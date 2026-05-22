// 把每日要闻同步成飞书 Docx,挂载到 FEISHU_FOLDER_TOKEN 指定的文件夹下。
// 用法:
//   node scripts/sync-feishu.mjs                     # 默认同步最近 3 天(防漏补发)
//   node scripts/sync-feishu.mjs --all               # 全量回填所有历史日期
//   node scripts/sync-feishu.mjs --date=YYYY-MM-DD   # 只同步指定某天
// 需要环境变量:FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_FOLDER_TOKEN。
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
  const ordered = {};
  for (const k of Object.keys(state).sort().reverse()) ordered[k] = state[k];
  await writeFile(STATE_FILE, JSON.stringify(ordered, null, 2) + "\n", "utf8");
}

// ---------- 飞书认证(token 复用) ----------
function readEnv() {
  const appId = process.env.FEISHU_APP_ID || "";
  const appSecret = process.env.FEISHU_APP_SECRET || "";
  const folderToken = process.env.FEISHU_FOLDER_TOKEN || "";
  return { appId, appSecret, folderToken };
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
    throw new Error(`获取 tenant_access_token 失败:${res.status} code=${json.code} msg=${json.msg || ""}`);
  }
  _token = json.tenant_access_token;
  // 提前 60s 视为过期,避免临界刷新
  _tokenExpiresAt = Date.now() + Math.max(60, (json.expire || 7200) - 60) * 1000;
  return _token;
}

// ---------- 飞书 HTTP 封装 ----------
async function feishu(apiPath, { method = "GET", body, headers = {}, env } = {}) {
  const token = await getToken(env.appId, env.appSecret);
  const finalHeaders = { Authorization: `Bearer ${token}`, ...headers };
  let finalBody = body;
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = finalHeaders["Content-Type"] || "application/json; charset=utf-8";
    if (typeof body !== "string") finalBody = JSON.stringify(body);
  }
  const res = await fetch(`${FEISHU_BASE}${apiPath}`, { method, headers: finalHeaders, body: finalBody });
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

// ---------- Markdown 渲染 ----------
function escapeMd(s) {
  return String(s).replace(/([[\]])/g, "\\$1").replace(/\s+/g, " ").trim();
}

function byDateDesc(a, b) {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

// 把当天要闻渲染成 Markdown。结构与 archive/YYYY/YYYY-MM-DD.md 风格一致。
// 摘要只放 summary(Yoast description),不放全文,避免成为主站内容副本。
function renderDailyMarkdown(date, items) {
  const lines = [];
  lines.push(`# ${config.siteName} · ${date}`);
  lines.push("");
  const sorted = items.slice().sort(byDateDesc);
  lines.push(
    `> 本日 AI 要闻 ${sorted.length} 篇 · 完整内容见 [${config.siteName}](${config.siteUrl}) · 历史归档见 [archive.llmposts.com](https://archive.llmposts.com)`
  );
  lines.push("");

  // 按分类分组,缺分类的归入「未分类」(与 archive 渲染保持一致)
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

  for (const cat of cats) {
    const arr = byCat.get(cat);
    const en = (config.categoryLabels || {})[cat];
    lines.push(`## ${cat}${en ? ` · ${en}` : ""} · ${arr.length} 篇`);
    lines.push("");
    for (const it of arr) {
      lines.push(`### ${escapeMd(it.title)}`);
      lines.push("");
      if (it.summary) {
        lines.push(it.summary);
        lines.push("");
      }
      lines.push(`[阅读全文 →](${it.link})`);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push(
    `> 由 [llmposts-daily](https://github.com/llmposts/llmposts-daily) 自动生成 · 完整内容请访问 [${config.siteName}](${config.siteUrl})`
  );
  lines.push("");
  return lines.join("\n");
}

// ---------- Feishu:upload → import → poll → delete ----------
// 把 Markdown 上传到云空间(parent_type=ccm_import_open),返回上传 file_token。
async function uploadMarkdown(env, name, markdown) {
  const buf = Buffer.from(markdown, "utf8");
  const form = new FormData();
  form.append("file_name", name);
  form.append("parent_type", "ccm_import_open");
  form.append("parent_node", env.folderToken);
  form.append("size", String(buf.length));
  // Node 20 原生 FormData 支持 Blob;Feishu 接收 multipart/form-data
  form.append("file", new Blob([buf], { type: "text/markdown" }), name);
  const data = await feishu("/open-apis/drive/v1/medias/upload_all", {
    method: "POST",
    body: form,
    env,
  });
  if (!data.file_token) throw new Error(`upload_all 未返回 file_token:${JSON.stringify(data)}`);
  return data.file_token;
}

// 创建导入任务,挂载点为目标文件夹(mount_type=1)。
async function createImportTask(env, fileToken, docTitle) {
  const data = await feishu("/open-apis/drive/v1/import_tasks", {
    method: "POST",
    body: {
      file_extension: "md",
      file_token: fileToken,
      type: "docx",
      file_name: docTitle,
      point: { mount_type: 1, mount_key: env.folderToken },
    },
    env,
  });
  if (!data.ticket) throw new Error(`import_tasks 未返回 ticket:${JSON.stringify(data)}`);
  return data.ticket;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 轮询导入任务:最多 30 次 × 2s = 60s。成功标志是 result.token 非空。
async function pollImportTask(env, ticket, { maxAttempts = 30, intervalMs = 2000 } = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await sleep(intervalMs);
    const data = await feishu(`/open-apis/drive/v1/import_tasks/${ticket}`, { env });
    const r = data && data.result;
    if (r && r.token) return { token: r.token, url: r.url || "" };
    if (r && r.job_error_msg) {
      throw new Error(`导入失败(job_status=${r.job_status}):${r.job_error_msg}`);
    }
    // 仍在处理,继续
  }
  throw new Error(`导入任务轮询超时(${(maxAttempts * intervalMs) / 1000}s,ticket=${ticket})`);
}

// 删除旧 Docx(覆盖更新时调用)。失败不抛,只记录,避免阻塞主流程。
async function deleteDocx(env, docToken) {
  await feishu(`/open-apis/drive/v1/files/${docToken}?type=docx`, { method: "DELETE", env });
}

// ---------- 同步单日 ----------
function pickDates(args, byDate) {
  const keys = [...byDate.keys()].sort(); // 升序
  if (args.all) return keys; // 全量按时间从早到晚同步,便于断点续传
  if (args.date) return [args.date]; // 显式日期允许同步空集(后面会过滤)
  return keys.slice(-3).reverse(); // 最近 3 个有内容的日期(新→旧)
}

async function syncOneDay(env, date, items, state) {
  if (!items || items.length === 0) {
    console.log(`  ↳ ${date}: 当天无内容,跳过`);
    return "skip";
  }
  const prev = state[date];
  if (prev && prev.last_synced_count === items.length && prev.doc_token) {
    console.log(`  ↳ ${date}: 内容无变化(${items.length} 篇),跳过`);
    return "skip";
  }
  const docTitle = `${config.siteName} · ${date}`;
  const md = renderDailyMarkdown(date, items);
  console.log(`  · ${date}: 上传 Markdown(${Buffer.byteLength(md, "utf8")} 字节)...`);
  const mediaToken = await uploadMarkdown(env, `${docTitle}.md`, md);
  console.log(`  · ${date}: 创建导入任务...`);
  const ticket = await createImportTask(env, mediaToken, docTitle);
  console.log(`  · ${date}: 轮询任务 ${ticket} ...`);
  const result = await pollImportTask(env, ticket);
  state[date] = {
    doc_token: result.token,
    url: result.url,
    last_synced_count: items.length,
    last_synced_at: new Date().toISOString(),
  };
  await saveState(state); // 立即落盘,防止后续失败丢进度
  console.log(`  ✓ ${date}: 已生成 ${result.url || result.token}`);
  if (prev && prev.doc_token && prev.doc_token !== result.token) {
    try {
      await deleteDocx(env, prev.doc_token);
      console.log(`  · ${date}: 已删除旧 Docx ${prev.doc_token}`);
    } catch (e) {
      console.warn(`  ! ${date}: 删除旧 Docx 失败(可忽略,需人工清理):${e.message}`);
    }
  }
  return "done";
}

// ---------- 主流程 ----------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = readEnv();
  if (!env.appId || !env.appSecret || !env.folderToken) {
    console.log("→ 未配置 FEISHU_APP_ID / FEISHU_APP_SECRET / FEISHU_FOLDER_TOKEN,跳过飞书同步");
    return;
  }

  const db = await loadDB();
  if (!db.length) {
    console.log("→ posts.json 为空,无内容可同步");
    return;
  }

  // 按 YYYY-MM-DD 分组
  const byDate = new Map();
  for (const it of db) {
    const key = String(it.date || "").slice(0, 10);
    if (!key) continue;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(it);
  }

  const state = await loadState();
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
      const r = await syncOneDay(env, date, items, state);
      if (r === "done") done++;
      else skip++;
    } catch (e) {
      failed++;
      console.error(`  ✗ ${date}: ${e.message}`);
    }
    // 导入任务有配额,日与日之间留 2.5s 缓冲
    if (i < dates.length - 1) await sleep(2500);
  }

  console.log(`✓ 完成:同步 ${done},跳过 ${skip},失败 ${failed}`);
  // 单天失败不让整个流程 fail —— 但若一篇都没成功且至少一篇失败,以非零退出
  if (failed > 0 && done === 0 && skip === 0) process.exit(1);
}

main().catch((e) => {
  console.error(`\n✗ ${e && e.stack ? e.stack : e}\n`);
  process.exit(1);
});
