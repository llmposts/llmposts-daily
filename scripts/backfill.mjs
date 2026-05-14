// 一次性回填:用 WordPress REST API 抓取 llmposts.com 至今所有文章,
// 合并进 archive/posts.json,重建全部每日归档与 README。运行:npm run backfill
import { config } from "./config.mjs";
import { fail, stripHtml, loadDB, mergeDB, saveDB, rebuildAll } from "./lib.mjs";

const API = config.siteUrl.replace(/\/+$/, "") + "/wp-json/wp/v2";
const PER_PAGE = 100;

async function getJson(url) {
  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "llmposts-daily" } });
  } catch (e) {
    fail(`请求失败:${e.message} — ${url}`);
  }
  if (res.status === 400) return { data: null, total: 0 }; // 翻过末页 WP 会返回 400
  if (!res.ok) fail(`请求失败:HTTP ${res.status} — ${url}`);
  return { data: await res.json(), total: Number(res.headers.get("x-wp-total")) || 0 };
}

async function fetchCategories() {
  const map = new Map();
  for (let page = 1; ; page++) {
    const { data } = await getJson(`${API}/categories?per_page=${PER_PAGE}&page=${page}&_fields=id,name`);
    if (!data || !data.length) break;
    for (const c of data) map.set(c.id, stripHtml(c.name));
    if (data.length < PER_PAGE) break;
  }
  return map;
}

async function fetchAllPosts() {
  const posts = [];
  let total = 0;
  for (let page = 1; ; page++) {
    const { data, total: t } = await getJson(
      `${API}/posts?per_page=${PER_PAGE}&page=${page}&_fields=id,date_gmt,link,title,excerpt,categories`
    );
    if (t) total = t;
    if (!data || !data.length) break;
    posts.push(...data);
    console.log(`  · 第 ${page} 页:+${data.length}(累计 ${posts.length}${total ? ` / ${total}` : ""})`);
    if (data.length < PER_PAGE) break;
  }
  return posts;
}

function normalize(posts, catMap) {
  return posts
    .map((p) => {
      const d = new Date((p.date_gmt || "") + "Z"); // date_gmt 是 UTC,补 Z 再解析
      const catId = (p.categories || [])[0];
      return {
        title: stripHtml(p.title && p.title.rendered),
        link: p.link || "",
        date: isNaN(d.getTime()) ? null : d.toISOString(),
        summary: stripHtml((p.excerpt && p.excerpt.rendered) || ""),
        category: (catId && catMap.get(catId)) || "",
      };
    })
    .filter((p) => p.title && p.link && p.date);
}

async function main() {
  console.log(`→ WordPress REST API:${API}`);
  const catMap = await fetchCategories();
  console.log(`  ✓ 分类 ${catMap.size} 个`);

  const raw = await fetchAllPosts();
  const incoming = normalize(raw, catMap);
  if (!incoming.length) fail("REST API 没有返回任何可用文章。");
  console.log(`  ✓ 规整出 ${incoming.length} 篇`);

  const db = await loadDB();
  const merged = mergeDB(db, incoming);
  await saveDB(merged);

  const { days, items } = await rebuildAll(merged);
  console.log(`→ 新增 ${merged.length - db.length} 篇,归档共 ${items} 篇 / ${days} 天`);
  console.log("✓ 回填完成");
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
