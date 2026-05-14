// 共享核心:WordPress REST API 抓取、数据层读写、按分类编号的归档与 README 生成。
// generate.mjs(每小时增量)和 backfill.mjs(一次性全量回填)都基于它。
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE_DIR = path.join(ROOT, "archive");
const DB_FILE = path.join(ARCHIVE_DIR, "posts.json");
const README = path.join(ROOT, "README.md");
const API = config.siteUrl.replace(/\/+$/, "") + "/wp-json/wp/v2";

export function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// ---------- 文本工具 ----------
function safeCodePoint(n) {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
}

export function stripHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, n) => safeCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => safeCodePoint(parseInt(n, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

// date 字段是站点本地时间字符串(如 2026-05-14T13:57:31),直接取日期部分
function dateKey(d) {
  return String(d || "").slice(0, 10);
}

// 按 date 字符串倒序(同一时区、定宽 ISO 格式,字符串比较即时间顺序)
function byDateDesc(a, b) {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}

function escapeMd(s) {
  return String(s).replace(/([[\]])/g, "\\$1").replace(/\s+/g, " ").trim();
}

// ---------- WordPress REST API ----------
async function getJson(url) {
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "llmposts-daily" } });
  } catch (e) {
    fail(`请求失败:${e.message} — ${url}`);
  }
  if (res.status === 400) return { data: null, total: 0 }; // 翻过末页 WP 返回 400
  if (!res.ok) fail(`请求失败:HTTP ${res.status} — ${url}`);
  return { data: await res.json(), total: Number(res.headers.get("x-wp-total")) || 0 };
}

// 分类 id → 名称
export async function fetchCategories() {
  const map = new Map();
  for (let page = 1; ; page++) {
    const { data } = await getJson(`${API}/categories?per_page=100&page=${page}&_fields=id,name`);
    if (!data || !data.length) break;
    for (const c of data) map.set(c.id, stripHtml(c.name));
    if (data.length < 100) break;
  }
  return map;
}

const POST_FIELDS =
  "date,link,title,categories,excerpt,yoast_head_json.description,yoast_head_json.og_description";

// 抓文章:{ all:true } 翻完所有页;否则只抓第一页 perPage 篇(按发布时间倒序)
export async function fetchPosts({ perPage = 100, all = false } = {}) {
  const posts = [];
  let total = 0;
  for (let page = 1; ; page++) {
    const { data, total: t } = await getJson(
      `${API}/posts?per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=${POST_FIELDS}`
    );
    if (t) total = t;
    if (!data || !data.length) break;
    posts.push(...data);
    if (!all || data.length < perPage) break;
  }
  return { posts, total };
}

// WP 文章 → 数据层记录。summary 优先用 Yoast meta description(完整、独立的摘要)。
export function normalizePost(p, catMap) {
  const yoast = p.yoast_head_json || {};
  const catId = (p.categories || [])[0];
  return {
    title: stripHtml(p.title && p.title.rendered),
    link: p.link || "",
    date: typeof p.date === "string" ? p.date : "", // 站点本地时间,如 2026-05-14T13:57:31
    summary: stripHtml(
      yoast.description || yoast.og_description || (p.excerpt && p.excerpt.rendered) || ""
    ),
    category: (catId && catMap.get(catId)) || "",
  };
}

// ---------- 数据层:archive/posts.json ----------
export async function loadDB() {
  if (!existsSync(DB_FILE)) return [];
  try {
    const arr = JSON.parse(await readFile(DB_FILE, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    fail(`读取 ${path.relative(ROOT, DB_FILE)} 失败:${e.message}`);
  }
}

// 按 link 去重合并;incoming 覆盖同 link 的旧记录。只增不减,返回按时间倒序的数组。
export function mergeDB(existing, incoming) {
  const byLink = new Map();
  for (const it of existing) if (it && it.link) byLink.set(it.link, it);
  for (const it of incoming) if (it && it.link) byLink.set(it.link, it);
  return [...byLink.values()]
    .filter((it) => it.title && it.link && it.date)
    .sort(byDateDesc);
}

export async function saveDB(items) {
  await mkdir(ARCHIVE_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(items, null, 2) + "\n", "utf8");
}

// ---------- 渲染 ----------
function categoryRank(name) {
  const i = (config.categoryOrder || []).indexOf(name);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

// 单条要闻:标题链接 + 摘要 + 回原文链接(都指向 llmposts.com)
function renderItem(item, level) {
  const h = "#".repeat(level);
  return (
    `${h} [${escapeMd(item.title)}](${item.link})\n\n` +
    (item.summary ? `${item.summary}\n\n` : "") +
    `[阅读全文 →](${item.link})`
  );
}

// 一个分类小节:## 01 · 模型动态 · Model Updates · 5 篇
function renderSection(index, category, items, level) {
  const num = String(index).padStart(2, "0");
  const en = (config.categoryLabels || {})[category];
  const heading =
    `${"#".repeat(level)} ${num} · ${category}${en ? ` · ${en}` : ""} · ${items.length} 篇`;
  const body = items
    .slice()
    .sort(byDateDesc)
    .map((it) => renderItem(it, level + 1))
    .join("\n\n");
  return `${heading}\n\n${body}`;
}

// 把一组要闻按分类分成编号小节。level = 分类标题的 markdown 级别。
function renderSections(items, level = 2) {
  const byCat = new Map();
  for (const it of items) {
    const cat = it.category || "未分类";
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(it);
  }
  const cats = [...byCat.keys()].sort((a, b) => {
    const r = categoryRank(a) - categoryRank(b);
    return r !== 0 ? r : byCat.get(b).length - byCat.get(a).length;
  });
  return cats.map((cat, i) => renderSection(i + 1, cat, byCat.get(cat), level)).join("\n\n");
}

// meta description:日期 + 篇数 + 标题串,截到约定字数
function buildDescription(key, items) {
  const max = config.metaDescriptionMaxLength || 150;
  const titles = items.slice().sort(byDateDesc).map((it) => stripHtml(it.title));
  let desc = `${key} AI 要闻汇总(${items.length} 篇):`;
  for (let i = 0; i < titles.length; i++) {
    const piece = (i === 0 ? "" : ";") + titles[i];
    if (i > 0 && desc.length + piece.length > max) {
      desc += "…";
      break;
    }
    desc += piece;
  }
  return desc;
}

// YAML 双引号字符串(转义反斜杠和引号)
function yamlString(s) {
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

async function writeDailyFile(key, items) {
  const file = path.join(ARCHIVE_DIR, key.slice(0, 4), `${key}.md`);
  await mkdir(path.dirname(file), { recursive: true });
  const frontMatter =
    `---\n` +
    `title: ${yamlString(`${config.siteName} · ${key}`)}\n` +
    `description: ${yamlString(buildDescription(key, items))}\n` +
    `date: ${key}\n` +
    `---\n`;
  const header =
    `<!-- 此文件由脚本自动生成(scripts/),请勿手动编辑 -->\n` +
    `# ${config.siteName} · ${key}\n\n` +
    `> 当日 AI 要闻汇总 · 共 ${items.length} 篇 · 点「阅读全文」看完整内容 👉 [${config.siteName}](${config.siteUrl})`;
  const sections = renderSections(items, 2);
  const footer = `📮 [返回首页](../../README.md) · 🌐 [${config.siteName}](${config.siteUrl})`;
  await writeFile(file, `${frontMatter}\n${header}\n\n${sections}\n\n---\n\n${footer}\n`, "utf8");
}

async function updateReadme(items) {
  if (!existsSync(README)) fail("找不到 README.md");
  let md = await readFile(README, "utf8");

  // 「最新汇总」:最新一天的完整简报(分类编号小节)
  const latestKey = items.length ? dateKey(items[0].date) : "";
  const latestItems = items.filter((it) => dateKey(it.date) === latestKey);
  const briefing = latestItems.length
    ? `**${latestKey} · 共 ${latestItems.length} 篇**\n\n${renderSections(latestItems, 3)}`
    : "_暂无内容_";
  const recentRe = /<!-- RECENT:START -->[\s\S]*?<!-- RECENT:END -->/;
  if (!recentRe.test(md)) fail("README.md 缺少 <!-- RECENT:START --> ... <!-- RECENT:END --> 标记");
  md = md.replace(recentRe, `<!-- RECENT:START -->\n${briefing}\n<!-- RECENT:END -->`);

  // 「历史归档」:按年份列出(根据实际数据)
  const years = [...new Set(items.map((it) => dateKey(it.date).slice(0, 4)))]
    .filter(Boolean)
    .sort()
    .reverse();
  const archiveList = years.map((y) => `- [\`archive/${y}/\`](archive/${y}/) — ${y} 年`).join("\n");
  const archiveRe = /<!-- ARCHIVE:START -->[\s\S]*?<!-- ARCHIVE:END -->/;
  if (archiveRe.test(md)) {
    md = md.replace(archiveRe, `<!-- ARCHIVE:START -->\n${archiveList}\n<!-- ARCHIVE:END -->`);
  }

  // 最后更新:用最新一篇的日期(只有真有新内容时 README 才会变 → 不会每小时空提交)
  const updatedRe = /<!-- UPDATED:START -->[\s\S]*?<!-- UPDATED:END -->/;
  if (updatedRe.test(md)) {
    md = md.replace(updatedRe, `<!-- UPDATED:START -->${latestKey || "—"}<!-- UPDATED:END -->`);
  }
  await writeFile(README, md, "utf8");
}

// 从完整记录列表重建所有每日归档文件 + 刷新 README。
// 渲染是确定性的:未变化的 .md 内容不变 → git 不会产生噪音 diff。
export async function rebuildAll(items) {
  const byDate = new Map();
  for (const it of items) {
    const key = dateKey(it.date);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(it);
  }
  for (const [key, dayItems] of [...byDate].sort((a, b) => (a[0] < b[0] ? 1 : -1))) {
    await writeDailyFile(key, dayItems);
  }
  await updateReadme(items);
  return { days: byDate.size, items: items.length };
}
