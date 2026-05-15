import postsJson from "../../../archive/posts.json";
import { categoryRank } from "./categories";
import { dateKey } from "./dates";

export interface Post {
  title: string;
  link: string;
  date: string;
  summary: string;
  category: string;
}

const ALL_POSTS: Post[] = (postsJson as Post[]).filter(
  (p) => p && p.title && p.link && p.date,
);

export interface CategoryGroup {
  category: string;
  posts: Post[];
}

export interface DayGroup {
  key: string;
  posts: Post[];
  categories: CategoryGroup[];
}

export function allPosts(): Post[] {
  return ALL_POSTS;
}

export function getAvailableDateKeys(): string[] {
  const set = new Set<string>();
  for (const p of ALL_POSTS) set.add(dateKey(p.date));
  return [...set].sort((a, b) => (a < b ? 1 : -1));
}

export function postsByDay(key: string): Post[] {
  return ALL_POSTS.filter((p) => dateKey(p.date) === key).sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function postsByCategory(zh: string): Post[] {
  return ALL_POSTS.filter((p) => p.category === zh).sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function groupByCategory(posts: Post[]): CategoryGroup[] {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const cat = p.category || "未分类";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p);
  }
  return [...map.entries()]
    .sort(([a, aPosts], [b, bPosts]) => {
      const r = categoryRank(a) - categoryRank(b);
      return r !== 0 ? r : bPosts.length - aPosts.length;
    })
    .map(([category, posts]) => ({
      category,
      posts: posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1)),
    }));
}

export function dayGroup(key: string): DayGroup {
  const posts = postsByDay(key);
  return { key, posts, categories: groupByCategory(posts) };
}

export function recentDays(n: number = 7): DayGroup[] {
  return getAvailableDateKeys().slice(0, n).map(dayGroup);
}

export function dayHistogram(): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of ALL_POSTS) {
    const k = dateKey(p.date);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}

/** 构建海报渲染所需的扁平数据(从 DayGroup) */
export function buildPosterData(day: DayGroup, siteOrigin: string) {
  // 动态 import 避免 lib/data 强依赖客户端模块;运行时不需要 poster.ts。
  return {
    dateKey: day.key,
    // formalDate 由 dates.ts 提供
    posts: day.posts.map((p) => ({
      title: p.title,
      summary: p.summary,
      link: p.link,
      category: p.category,
    })),
    categoryCounts: day.categories.map((c) => ({
      category: c.category,
      count: c.posts.length,
    })),
    vol: day.key.replace(/-/g, "."),
    url: `${siteOrigin.replace(/\/$/, "")}/daily/${day.key}/`,
  };
}

/** 按日期分组某个分类的全部文章 → DayGroup[](每天只含该分类的 post) */
export function categoryDayGroups(zh: string): DayGroup[] {
  const byKey = new Map<string, Post[]>();
  for (const p of ALL_POSTS) {
    if (p.category !== zh) continue;
    const k = dateKey(p.date);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(p);
  }
  return [...byKey.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, posts]) => {
      const sorted = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
      return {
        key,
        posts: sorted,
        categories: [{ category: zh, posts: sorted }],
      };
    });
}
