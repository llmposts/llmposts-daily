// 一次性全量回填:从 WordPress REST API 抓取 llmposts.com 所有文章,
// 合并进 archive/posts.json,重建全部归档与 README。运行:npm run backfill
import { config } from "./config.mjs";
import {
  fail, fetchCategories, fetchPosts, normalizePost,
  loadDB, mergeDB, saveDB, rebuildAll,
} from "./lib.mjs";

async function main() {
  console.log(`→ WordPress REST API:${config.siteUrl}(全量回填)`);
  const catMap = await fetchCategories();
  console.log(`  ✓ 分类 ${catMap.size} 个`);

  const { posts, total } = await fetchPosts({ perPage: 100, all: true });
  const incoming = posts
    .map((p) => normalizePost(p, catMap))
    .filter((p) => p.title && p.link && p.date);
  if (!incoming.length) fail("REST API 没返回任何可用文章。");
  console.log(`  ✓ 抓取 ${incoming.length} 篇${total ? ` / ${total}` : ""}`);

  const db = await loadDB();
  const merged = mergeDB(db, incoming);
  await saveDB(merged);

  const { days, items } = await rebuildAll(merged);
  console.log(`→ 新增 ${merged.length - db.length} 篇,归档共 ${items} 篇 / ${days} 天`);
  console.log("✓ 回填完成");
}

main().catch((e) => fail(e && e.stack ? e.stack : String(e)));
