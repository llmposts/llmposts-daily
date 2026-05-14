// 抓取 llmposts.com 的 RSS,生成每日要闻汇总归档,并刷新 README 的「最近要闻」。
// 由 .github/workflows/daily-digest.yml 每天自动调用;本地调试:npm run generate
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";
import { config } from "./config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE_DIR = path.join(ROOT, "archive");
const README = path.join(ROOT, "README.md");
const TZ = config.timeZone || "Asia/Shanghai";

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!config.rssUrl) {
  fail(
    "尚未配置 RSS 地址。\n" +
      "  1) 先给 llmposts.com 加上 RSS feed;\n" +
      "  2) 把 feed 地址填进 scripts/config.mjs 的 rssUrl(或设置环境变量 RSS_URL)。"
  );
}

// ---------- 文本工具 ----------
function dateKey(d) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(d);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function stripHtml(s) {
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

function safeCodePoint(n) {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
}

// 把描述截断成「钩子」长度,尽量在标点处断开 —— 不把全文搬到 GitHub
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

// ---------- RSS 抓取与解析 ----------
function toArray(x) { return x == null ? [] : Array.isArray(x) ? x : [x]; }

function text(x) {
  if (x == null) return "";
  if (typeof x === "string" || typeof x === "number") return String(x).trim();
  if (typeof x === "object" && "#text" in x) return String(x["#text"]).trim();
  return "";
}

function atomLink(link) {
  const links = toArray(link);
  const alt = links.find((l) => l && l["@_rel"] === "alternate") || links[0];
  if (!alt) return "";
  return typeof alt === "string" ? alt : alt["@_href"] || "";
}

function firstCategory(cat) {
  const c = toArray(cat)[0];
  if (!c) return "";
  if (typeof c === "string") return c.trim();
  return String(c["@_term"] || c["#text"] || "").trim();
}

function parseDate(s) {
  const v = text(s);
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

// 同时兼容 RSS 2.0 与 Atom
function normalizeItems(doc) {
  const out = [];
  const channel = doc && doc.rss && doc.rss.channel;
  if (channel) {
    for (const it of toArray(channel.item)) {
      out.push({
        title: text(it.title),
        link: text(it.link),
        date: parseDate(it.pubDate || it["dc:date"]),
        summary: text(it.description) || text(it["content:encoded"]),
        category: firstCategory(it.category),
      });
    }
  }
  const feed = doc && doc.feed;
  if (feed) {
    for (const e of toArray(feed.entry)) {
      out.push({
        title: text(e.title),
        link: atomLink(e.link),
        date: parseDate(e.published || e.updated),
        summary: text(e.summary) || text(e.content),
        category: firstCategory(e.category),
      });
    }
  }
  return out.filter((i) => i.title && i.link && i.date);
}

async function fetchFeed(url) {
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "llmposts-daily" } });
  } catch (e) {
    fail(`抓取 RSS 失败:${e.message}`);
  }
  if (!res.ok) fail(`抓取 RSS 失败:HTTP ${res.status} — ${url}`);
  const xml = await res.text();
  let doc;
  try {
    doc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" }).parse(xml);
  } catch (e) {
    fail(`RSS 解析失败:${e.message}`);
  }
  return normalizeItems(doc);
}

// ---------- 渲染 ----------
function renderItem(item) {
  const tag = item.category ? ` \`${item.category}\`` : "";
  const t = teaser(item.summary);
  return (
    `### [${escapeMd(item.title)}](${item.link})${tag}\n\n` +
    (t ? `${t}\n\n` : "") +
    `[阅读全文 →](${item.link})\n`
  );
}

async function writeDailyFile(key, items) {
  const file = path.join(ARCHIVE_DIR, key.slice(0, 4), `${key}.md`);
  await mkdir(path.dirname(file), { recursive: true });
  const header =
    `<!-- 此文件由 GitHub Action 自动生成,请勿手动编辑 -->\n` +
    `# ${config.siteName} · ${key}\n\n` +
    `> 以下为要闻摘要,点击「阅读全文」查看完整文章 👉 [${config.siteName}](${config.siteUrl})\n`;
  const body = items.map(renderItem).join("\n---\n\n");
  const footer = `\n---\n\n📮 [返回首页](../../README.md) · 🌐 [${config.siteName}](${config.siteUrl})\n`;
  await writeFile(file, `${header}\n${body}\n${footer}`, "utf8");
}

async function updateReadme(items) {
  if (!existsSync(README)) fail("找不到 README.md");
  let md = await readFile(README, "utf8");

  const top = [...items].sort((a, b) => b.date - a.date).slice(0, config.recentCount || 12);
  const list = top
    .map((it) => {
      const tag = it.category ? ` \`${it.category}\`` : "";
      return `- \`${dateKey(it.date)}\` [${escapeMd(it.title)}](${it.link})${tag}`;
    })
    .join("\n");

  const recentRe = /<!-- RECENT:START -->[\s\S]*?<!-- RECENT:END -->/;
  if (!recentRe.test(md)) fail("README.md 缺少 <!-- RECENT:START --> ... <!-- RECENT:END --> 标记");
  md = md.replace(recentRe, `<!-- RECENT:START -->\n${list}\n<!-- RECENT:END -->`);

  const updatedRe = /<!-- UPDATED:START -->[\s\S]*?<!-- UPDATED:END -->/;
  if (updatedRe.test(md)) {
    md = md.replace(updatedRe, `<!-- UPDATED:START -->${dateKey(new Date())}<!-- UPDATED:END -->`);
  }
  await writeFile(README, md, "utf8");
}

// ---------- 主流程 ----------
async function main() {
  console.log(`→ 抓取 RSS:${config.rssUrl}`);
  const items = await fetchFeed(config.rssUrl);
  if (!items.length) fail("没有从 RSS 解析到任何文章,请检查 feed 地址或格式。");
  console.log(`→ 解析到 ${items.length} 条要闻`);

  // 按日期分组:RSS 里出现的每个日期都重新生成对应归档文件,
  // 不在 feed 里的旧日期文件保持不动(已在 git 历史中长期保留)。
  const byDate = new Map();
  for (const it of items) {
    const key = dateKey(it.date);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push(it);
  }

  for (const [key, dayItems] of [...byDate].sort((a, b) => (a[0] < b[0] ? 1 : -1))) {
    dayItems.sort((a, b) => b.date - a.date);
    await writeDailyFile(key, dayItems);
    console.log(`  ✓ archive/${key.slice(0, 4)}/${key}.md(${dayItems.length} 条)`);
  }

  await updateReadme(items);
  console.log(`  ✓ README.md「最近要闻」已刷新`);
  console.log("\n✓ 完成");
}

main().catch((e) => fail(e.stack || String(e)));
