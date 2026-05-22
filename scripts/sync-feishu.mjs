// 把每日要闻同步成飞书 Wiki 子节点 —— 父节点 FEISHU_WIKI_PARENT_NODE_TOKEN 下每天一篇 docx,
// 标题为「大模型邮报 · YYYY-MM-DD」,内容与 archive/YYYY/YYYY-MM-DD.md 结构一致:
// 顶部一句话引导 → 按分类分组的编号小节 → 每篇 H3 标题(超链)+ 摘要 + 阅读全文 → 底部分割线 + 官网链接。
//
// 行为:每次 sync 重写当天节点的全部内容(idempotent;内容数未变则跳过)。
//
// 用法:
//   node scripts/sync-feishu.mjs                     # 默认同步最近 3 天
//   node scripts/sync-feishu.mjs --all               # 全量回填所有历史日期
//   node scripts/sync-feishu.mjs --date=YYYY-MM-DD   # 只同步指定某天
// 需要环境变量:FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_WIKI_PARENT_NODE_TOKEN
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.mjs";
import { loadDB } from "./lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE_FILE = path.join(ROOT, "archive", "feishu-sync.json");
const FEISHU_BASE = "https://open.feishu.cn";

// ---------- CLI ----------
function parseArgs(argv) {
  const args = { all: false, date: null };
  for (const a of argv) {
    if (a === "--all") args.all = true;
    else if (a.startsWith("--date=")) args.date = a.slice("--date=".length);
    else throw new Error(`未知参数: ${a}`);
  }
  if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
    throw new Error(`--date 格式应为 YYYY-MM-DD,得到: ${args.date}`);
  }
  if (args.date && args.all) throw new Error("--date 与 --all 互斥");
  return args;
}

// ---------- 状态文件 ----------
// {
//   "_meta": { "space_id": "...", "parent_node_token": "..." },
//   "2026-05-22": {
//     "node_token": "...",      // wiki 节点 token
//     "obj_token": "...",        // 底层 docx token
//     "last_synced_count": 6,
//     "last_synced_at": "..."
//   }
// }
async function loadState() {
  if (!existsSync(STATE_FILE)) return {};
  try {
    const obj = JSON.parse(await readFile(STATE_FILE, "utf8"));
    return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
  } catch (e) {
    throw new Error(`读取 ${path.relative(ROOT, STATE_FILE)} 失败:${e.message}`);
  }
}

async function saveState(state) {
  const meta = state._meta || {};
  const dateKeys = Object.keys(state).filter((k) => k !== "_meta").sort().reverse();
  const ordered = { _meta: meta };
  for (const k of dateKeys) ordered[k] = state[k];
  await writeFile(STATE_FILE, JSON.stringify(ordered, null, 2) + "\n", "utf8");
}

// ---------- 飞书认证(token 复用) ----------
function readEnv() {
  return {
    appId: process.env.FEISHU_APP_ID || "",
    appSecret: process.env.FEISHU_APP_SECRET || "",
    parentNodeToken: process.env.FEISHU_WIKI_PARENT_NODE_TOKEN || "",
  };
}

let _token = null;
let _tokenExpiresAt = 0;
async function getToken(appId, appSecret) {
  if (_token && Date.now() < _tokenExpiresAt) return _token;
  const res = await fetch(`${FEISHU_BASE}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.code !== 0) {
    throw new Error(
      `获取 tenant_access_token 失败:${res.status} code=${json.code} msg=${json.msg || ""}`
    );
  }
  _token = json.tenant_access_token;
  _tokenExpiresAt = Date.now() + Math.max(60, (json.expire || 7200) - 60) * 1000;
  return _token;
}

// ---------- 飞书 HTTP ----------
async function feishu(apiPath, { method = "GET", body, env } = {}) {
  const token = await getToken(env.appId, env.appSecret);
  const headers = { Authorization: `Bearer ${token}` };
  let finalBody;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json; charset=utf-8";
    finalBody = typeof body === "string" ? body : JSON.stringify(body);
  }
  const res = await fetch(`${FEISHU_BASE}${apiPath}`, { method, headers, body: finalBody });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${method} ${apiPath}: ${text.slice(0, 300)}`);
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${method} ${apiPath} 返回非 JSON:${text.slice(0, 200)}`);
  }
  if (json.code !== 0) {
    throw new Error(`${method} ${apiPath} code=${json.code} msg=${json.msg || ""}`);
  }
  return json.data || {};
}

// ---------- Wiki API ----------
async function getWikiNodeInfo(env, nodeToken) {
  const data = await feishu(
    `/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(nodeToken)}&obj_type=wiki`,
    { env }
  );
  if (!data.node) throw new Error(`get_node 未返回 node:${JSON.stringify(data)}`);
  return data.node;
}

async function listChildren(env, spaceId, parentNodeToken) {
  const out = [];
  let pageToken = "";
  for (let i = 0; i < 20; i++) {
    const qs = new URLSearchParams({
      parent_node_token: parentNodeToken,
      page_size: "50",
    });
    if (pageToken) qs.set("page_token", pageToken);
    const data = await feishu(
      `/open-apis/wiki/v2/spaces/${encodeURIComponent(spaceId)}/nodes?${qs.toString()}`,
      { env }
    );
    out.push(...(data.items || []));
    if (!data.has_more) break;
    pageToken = data.page_token || "";
    if (!pageToken) break;
  }
  return out;
}

async function createChildNode(env, spaceId, parentNodeToken, title) {
  const data = await feishu(`/open-apis/wiki/v2/spaces/${encodeURIComponent(spaceId)}/nodes`, {
    method: "POST",
    body: {
      obj_type: "docx",
      parent_node_token: parentNodeToken,
      node_type: "origin",
      title,
    },
    env,
  });
  if (!data.node) throw new Error(`创建 wiki 节点失败:${JSON.stringify(data)}`);
  return data.node;
}

// ---------- Docx blocks API ----------
// Feishu docx 中,根 page block 的 block_id 等于 document_id(即 obj_token)
async function listRootChildren(env, docToken) {
  const out = [];
  let pageToken = "";
  for (let i = 0; i < 20; i++) {
    const qs = new URLSearchParams({ page_size: "500", document_revision_id: "-1" });
    if (pageToken) qs.set("page_token", pageToken);
    const data = await feishu(
      `/open-apis/docx/v1/documents/${docToken}/blocks/${docToken}/children?${qs.toString()}`,
      { env }
    );
    out.push(...(data.items || []));
    if (!data.has_more) break;
    pageToken = data.page_token || "";
    if (!pageToken) break;
  }
  return out;
}

async function wipeRootChildren(env, docToken) {
  const children = await listRootChildren(env, docToken);
  if (children.length === 0) return;
  // batch_delete 一次最多 50 个 —— 分批从尾往前删,避免 index 漂移
  const BATCH = 50;
  for (let end = children.length; end > 0; end -= BATCH) {
    const start = Math.max(0, end - BATCH);
    await feishu(
      `/open-apis/docx/v1/documents/${docToken}/blocks/${docToken}/children/batch_delete?document_revision_id=-1`,
      {
        method: "DELETE",
        body: { start_index: start, end_index: end },
        env,
      }
    );
  }
}

async function appendRootChildren(env, docToken, blocks) {
  const BATCH = 50;
  for (let i = 0; i < blocks.length; i += BATCH) {
    const chunk = blocks.slice(i, i + BATCH);
    await feishu(
      `/open-apis/docx/v1/documents/${docToken}/blocks/${docToken}/children?document_revision_id=-1`,
      {
        method: "POST",
        body: { children: chunk, index: -1 },
        env,
      }
    );
  }
}

// ---------- Block builders ----------
// 飞书 link.url 必须 URL 编码,否则有概率被截断或解析错
function encodeUrl(u) {
  return encodeURIComponent(String(u || ""));
}

function textRun(content) {
  return { text_run: { content: String(content || "") } };
}

function linkRun(text, url) {
  return {
    text_run: {
      content: String(text || ""),
      text_element_style: { link: { url: encodeUrl(url) } },
    },
  };
}

function paragraphBlock(elements) {
  return { block_type: 2, text: { elements, style: {} } };
}

// level 1 -> block_type 3 (heading1), level 2 -> 4, level 3 -> 5
function headingBlock(level, elements) {
  const map = { 1: 3, 2: 4, 3: 5 };
  const blockType = map[level] || 5;
  const key = `heading${level}`;
  return { block_type: blockType, [key]: { elements, style: {} } };
}

function dividerBlock() {
  return { block_type: 22, divider: {} };
}

function byDateDesc(a, b) {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

// 全量渲染当天内容,与 archive/YYYY/YYYY-MM-DD.md 结构一致
// (不包含 H1 顶层标题 —— wiki 节点的 title 已经承担了该作用)
function buildDailyBlocks(date, items) {
  const sorted = items.slice().sort(byDateDesc);
  const blocks = [];

  // 顶部引导
  blocks.push(
    paragraphBlock([
      textRun(`当日 AI 要闻汇总 · 共 ${sorted.length} 篇 · 点「阅读全文」看完整内容 👉 `),
      linkRun(config.siteName, config.siteUrl),
    ])
  );

  // 按分类分组,沿用 config.categoryOrder 的排序
  const byCat = new Map();
  for (const it of sorted) {
    const c = it.category || "未分类";
    if (!byCat.has(c)) byCat.set(c, []);
    byCat.get(c).push(it);
  }
  const order = config.categoryOrder || [];
  const cats = [...byCat.keys()].sort((a, b) => {
    const ra = order.indexOf(a);
    const rb = order.indexOf(b);
    const ka = ra === -1 ? Number.MAX_SAFE_INTEGER : ra;
    const kb = rb === -1 ? Number.MAX_SAFE_INTEGER : rb;
    if (ka !== kb) return ka - kb;
    return byCat.get(b).length - byCat.get(a).length;
  });

  cats.forEach((cat, idx) => {
    const arr = byCat.get(cat).slice().sort(byDateDesc);
    const en = (config.categoryLabels || {})[cat];
    const num = String(idx + 1).padStart(2, "0");
    // H2: 01 · 模型动态 · Model Updates · 5 篇
    blocks.push(
      headingBlock(2, [textRun(`${num} · ${cat}${en ? ` · ${en}` : ""} · ${arr.length} 篇`)])
    );
    for (const it of arr) {
      // H3 [标题](链接)
      blocks.push(headingBlock(3, [linkRun(it.title, it.link)]));
      if (it.summary) {
        blocks.push(paragraphBlock([textRun(it.summary)]));
      }
      blocks.push(paragraphBlock([linkRun("阅读全文 →", it.link)]));
    }
  });

  // 底部
  blocks.push(dividerBlock());
  blocks.push(paragraphBlock([textRun("🌐 "), linkRun(config.siteName, config.siteUrl)]));

  return blocks;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- 同步单日 ----------
async function syncOneDay(env, date, items, state, spaceId) {
  if (!items || items.length === 0) {
    console.log(`  ↳ ${date}: 当天无内容,跳过`);
    return "skip";
  }

  let entry = state[date];
  if (entry && entry.last_synced_count === items.length && entry.node_token) {
    console.log(`  ↳ ${date}: 内容无变化(${items.length} 篇),跳过`);
    return "skip";
  }

  let nodeToken = entry && entry.node_token;
  let objToken = entry && entry.obj_token;

  // 状态丢失或首次:看父节点下有没有同名 child
  if (!nodeToken) {
    const title = `${config.siteName} · ${date}`;
    const children = await listChildren(env, spaceId, env.parentNodeToken);
    const existing = children.find((n) => n.title === title);
    if (existing) {
      console.log(`  · ${date}: 复用已存在的子节点 "${title}"`);
      nodeToken = existing.node_token;
      objToken = existing.obj_token;
    } else {
      console.log(`  · ${date}: 创建 wiki 子节点 "${title}" ...`);
      const node = await createChildNode(env, spaceId, env.parentNodeToken, title);
      nodeToken = node.node_token;
      objToken = node.obj_token;
    }
  }

  console.log(`  · ${date}: 清空旧内容 ...`);
  await wipeRootChildren(env, objToken);

  const blocks = buildDailyBlocks(date, items);
  console.log(`  · ${date}: 写入 ${blocks.length} 个 block ...`);
  await appendRootChildren(env, objToken, blocks);

  state[date] = {
    node_token: nodeToken,
    obj_token: objToken,
    last_synced_count: items.length,
    last_synced_at: new Date().toISOString(),
  };
  await saveState(state);
  console.log(`  ✓ ${date}: 已同步 ${items.length} 篇`);
  return "done";
}

// ---------- 主流程 ----------
function pickDates(args, byDate) {
  const keys = [...byDate.keys()].sort();
  if (args.all) return keys;
  if (args.date) return [args.date];
  return keys.slice(-3).reverse();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = readEnv();
  if (!env.appId || !env.appSecret || !env.parentNodeToken) {
    console.log(
      "→ 未配置 FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_WIKI_PARENT_NODE_TOKEN,跳过飞书同步"
    );
    return;
  }

  const db = await loadDB();
  if (!db.length) {
    console.log("→ posts.json 为空,无内容可同步");
    return;
  }

  const byDate = new Map();
  for (const it of db) {
    const key = String(it.date || "").slice(0, 10);
    if (!key) continue;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(it);
  }

  const state = await loadState();

  // 取/缓存 space_id
  let spaceId = state._meta && state._meta.space_id;
  if (!spaceId || (state._meta && state._meta.parent_node_token !== env.parentNodeToken)) {
    console.log(`→ 解析 wiki space_id(parent=${env.parentNodeToken}) ...`);
    const node = await getWikiNodeInfo(env, env.parentNodeToken);
    spaceId = node.space_id;
    if (!spaceId) throw new Error(`get_node 没返回 space_id`);
    state._meta = { space_id: spaceId, parent_node_token: env.parentNodeToken };
    await saveState(state);
  }
  console.log(`→ space_id: ${spaceId}`);

  const dates = pickDates(args, byDate);
  const mode = args.all ? "--all" : args.date ? `--date=${args.date}` : "最近 3 天";
  console.log(`→ 模式:${mode},计划同步 ${dates.length} 个日期`);

  let done = 0;
  let skip = 0;
  let failed = 0;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const items = byDate.get(date) || [];
    try {
      const r = await syncOneDay(env, date, items, state, spaceId);
      if (r === "done") done++;
      else skip++;
    } catch (e) {
      failed++;
      console.error(`  ✗ ${date}: ${e.message}`);
    }
    if (i < dates.length - 1) await sleep(2500);
  }

  console.log(`✓ 完成:同步 ${done},跳过 ${skip},失败 ${failed}`);
  if (failed > 0 && done === 0 && skip === 0) process.exit(1);
}

main().catch((e) => {
  console.error(`\n✗ ${e && e.stack ? e.stack : e}\n`);
  process.exit(1);
});
