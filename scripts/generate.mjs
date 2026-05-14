// 每小时增量:从 WordPress REST API 拉取最近文章,合并进 archive/posts.json,重建归档与 README。
// 由 .github/workflows/daily-digest.yml 每小时自动调用;本地调试:npm run generate
import { config } from "./config.mjs";
import {
  fail, fetchCategories, fetchPosts, normalizePost,
  loadDB, mergeDB, saveDB, rebuildAll,
} from "./lib.mjs";

async function main() {
  console.log(`→ WordPress REST API:${config.siteUrl}`);
  const catMap = await fetchCategories();
  const { posts } = await fetchPosts({ perPage: 30 }); // 最近 30 篇
  const incoming = posts
    .map((p) => normalizePost(p, catMap))
    .filter((p) => p.title && p.link && p.date);
  if (!incoming.length) fail("REST API 没返回任何可用文章。");
  console.log(`→ 拉取最近 ${incoming.length} 篇`);

  const db = await loadDB();
  const merged = mergeDB(db, incoming);
  await saveDB(merged);

  const { days, items } = await rebuildAll(merged);
  console.log(`→ 新增 ${merged.length - db.length} 篇,归档共 ${items} 篇 / ${days} 天`);
  console.log("✓ 完成");
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
