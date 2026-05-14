// 共享核心:数据层读写、文本清洗、按分类编号的每日归档与 README 生成。
// generate.mjs(每小时 RSS 增量)和 backfill.mjs(一次性全量回填)都基于它。
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE_DIR = path.join(ROOT, "archive");
const DB_FILE = path.join(ARCHIVE_DIR, "posts.json");
const README = path.join(ROOT, "README.md");
const TZ = config.timeZone || "Asia/Shanghai";

export function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// ---------- 文本工具 ----------
function dateKey(d) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

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
    // 去掉 WordPress RSS 自动附加的 "The post ... appeared first on ..." 尾巴
    .replace(/\s*The post\b[\s\S]*?appeared first on[\s\S]*$/i, "")
    // 常见命名实体
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "…")
    // 数字实体(&#8230; / &#x2026; 等)
    .replace(/&#(\d+);/g, (_, n) => safeCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => safeCodePoint(parseInt(n, 16)))
    // WordPress 截断标记 […] / [...] → 统一换成省略号
    .replace(/\s*\[(?:…|\.{3,})\]/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function teaser(s, max = config.summaryMaxLength || 110) {
  const clean = stripHtml(s);
  if (clean.length <= max) return clean;
  let cut = clean.slice(0, max);
  const stop = Math.max(
    cut.lastIndexOf("。"), cut.lastIndexOf("!"), cut.lastIndexOf("?"),
    cut.lastIndexOf("，"), cut.lastIndexOf(" ")
  );
  if (stop > max * 0.6) cut = cut.slice(0, stop + 1);
  return cut.trim() + "…";
}

function escapeMd(s) {
  return String(s).replace(/([[\]])/g, "\\$1").replace(/\s+/g, " ").trim();
}

// ---------- 数据层:archive/posts.json ----------
// 每条记录:{ title, link, date(ISO 字符串), summary(已清洗), category }

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
    .sort((a, b) => new Date(b.date) - new Date(a.date));
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

// 单条要闻:标题链接 + 摘要钩子 + 回原文链接(都指向 llmposts.com)
function renderItem(item) {
  const t = teaser(item.summary);
  return (
    `### [${escapeMd(item.title)}](${item.link})\n\n` +
    (t ? `${t}\n\n` : "") +
    `[阅读全文 →](${item.link})`
  );
}

// 一个分类小节:## 01 · 模型动态 · Model Updates · 5 篇
function renderSection(index, category, items) {
  const num = String(index).padStart(2, "0");
  const en = (config.categoryLabels || {})[category];
  const heading = `## ${num} · ${category}${en ? ` · ${en}` : ""} · ${items.length} 篇`;
  const body = items
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(renderItem)
    .join("\n\n");
  return `${heading}\n\n${body}`;
}

// meta description:日期 + 篇数 + 标题串,截到约定字数
function buildDescription(key, items) {
  const max = config.metaDescriptionMaxLength || 150;
  const titles = items
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((it) => stripHtml(it.title));
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

  // 按分类分组
  const byCat = new Map();
  for (const it of items) {
    const cat = it.category || "未分类";
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(it);
  }
  // 分类按 config.categoryOrder 排;同序按条数多→少
  const cats = [...byCat.keys()].sort((a, b) => {
    const r = categoryRank(a) - categoryRank(b);
    return r !== 0 ? r : byCat.get(b).length - byCat.get(a).length;
  });

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
  const sections = cats.map((cat, i) => renderSection(i + 1, cat, byCat.get(cat))).join("\n\n");
  const footer = `📮 [返回首页](../../README.md) · 🌐 [${config.siteName}](${config.siteUrl})`;

  await writeFile(file, `${frontMatter}\n${header}\n\n${sections}\n\n---\n\n${footer}\n`, "utf8");
}

async function updateReadme(items) {
  if (!existsSync(README)) fail("找不到 README.md");
  let md = await readFile(README, "utf8");

  // 「最近要闻」:最新 N 条(扁平列表,方便快速扫)
  const recentList = items
    .slice(0, config.recentCount || 12)
    .map((it) => {
      const tag = it.category ? ` \`${it.category}\`` : "";
      return `- \`${dateKey(new Date(it.date))}\` [${escapeMd(it.title)}](${it.link})${tag}`;
    })
    .join("\n");
  const recentRe = /<!-- RECENT:START -->[\s\S]*?<!-- RECENT:END -->/;
  if (!recentRe.test(md)) fail("README.md 缺少 <!-- RECENT:START --> ... <!-- RECENT:END --> 标记");
  md = md.replace(recentRe, `<!-- RECENT:START -->\n${recentList}\n<!-- RECENT:END -->`);

  // 「历史归档」:按年份列出(根据实际数据)
  const years = [...new Set(items.map((it) => dateKey(new Date(it.date)).slice(0, 4)))]
    .sort()
    .reverse();
  const archiveList = years.map((y) => `- [\`archive/${y}/\`](archive/${y}/) — ${y} 年`).join("\n");
  const archiveRe = /<!-- ARCHIVE:START -->[\s\S]*?<!-- ARCHIVE:END -->/;
  if (archiveRe.test(md)) {
    md = md.replace(archiveRe, `<!-- ARCHIVE:START -->\n${archiveList}\n<!-- ARCHIVE:END -->`);
  }

  // 最后更新时间
  const updatedRe = /<!-- UPDATED:START -->[\s\S]*?<!-- UPDATED:END -->/;
  if (updatedRe.test(md)) {
    md = md.replace(updatedRe, `<!-- UPDATED:START -->${dateKey(new Date())}<!-- UPDATED:END -->`);
  }
  await writeFile(README, md, "utf8");
}

// 从完整记录列表重建所有每日归档文件 + 刷新 README。
// 渲染是确定性的:未变化的 .md 内容不变 → git 不会产生噪音 diff。
export async function rebuildAll(items) {
  const byDate = new Map();
  for (const it of items) {
    const key = dateKey(new Date(it.date));
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(it);
  }
  for (const [key, dayItems] of [...byDate].sort((a, b) => (a[0] < b[0] ? 1 : -1))) {
    await writeDailyFile(key, dayItems);
  }
  await updateReadme(items);
  return { days: byDate.size, items: items.length };
}
