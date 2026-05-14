// 每小时增量:抓取 llmposts.com 的 RSS,合并进 archive/posts.json,重建归档与 README。
// 由 .github/workflows/daily-digest.yml 每小时自动调用;本地调试:npm run generate
import { XMLParser } from "fast-xml-parser";
import { config } from "./config.mjs";
import { fail, stripHtml, loadDB, mergeDB, saveDB, rebuildAll } from "./lib.mjs";

if (!config.rssUrl) {
  fail("尚未配置 RSS 地址。把 feed 地址填进 scripts/config.mjs 的 rssUrl(或设置环境变量 RSS_URL)。");
}

// ---------- RSS 解析(兼容 RSS 2.0 与 Atom)----------
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

// 统一成数据层格式:{ title, link, date(ISO), summary(已清洗), category }
function normalize(doc) {
  const out = [];
  const channel = doc && doc.rss && doc.rss.channel;
  if (channel) {
    for (const it of toArray(channel.item)) {
      const d = parseDate(it.pubDate || it["dc:date"]);
      out.push({
        title: text(it.title),
        link: text(it.link),
        date: d ? d.toISOString() : null,
        summary: stripHtml(text(it.description) || text(it["content:encoded"])),
        category: firstCategory(it.category),
      });
    }
  }
  const feed = doc && doc.feed;
  if (feed) {
    for (const e of toArray(feed.entry)) {
      const d = parseDate(e.published || e.updated);
      out.push({
        title: text(e.title),
        link: atomLink(e.link),
        date: d ? d.toISOString() : null,
        summary: stripHtml(text(e.summary) || text(e.content)),
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
  try {
    return new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" }).parse(xml);
  } catch (e) {
    fail(`RSS 解析失败:${e.message}`);
  }
}

async function main() {
  console.log(`→ 抓取 RSS:${config.rssUrl}`);
  const incoming = normalize(await fetchFeed(config.rssUrl));
  if (!incoming.length) fail("没有从 RSS 解析到任何文章,请检查 feed 地址或格式。");
  console.log(`→ RSS 解析到 ${incoming.length} 条`);

  const db = await loadDB();
  const merged = mergeDB(db, incoming);
  await saveDB(merged);

  const { days, items } = await rebuildAll(merged);
  console.log(`→ 新增 ${merged.length - db.length} 条,归档共 ${items} 篇 / ${days} 天`);
  console.log("✓ 完成");
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
