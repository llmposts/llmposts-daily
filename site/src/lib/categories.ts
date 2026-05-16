export interface CategoryMeta {
  zh: string;
  /** 2-char chip label */
  short: string;
  slug: string;
  en: string;
  colorVar: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { zh: "模型动态", short: "模型", slug: "model-updates", en: "Models",     colorVar: "--c-model" },
  { zh: "研究前沿", short: "研究", slug: "research",      en: "Research",   colorVar: "--c-research" },
  { zh: "工程实践", short: "工程", slug: "engineering",   en: "Engineering", colorVar: "--c-eng" },
  { zh: "教程指南", short: "教程", slug: "tutorials",     en: "Tutorials",  colorVar: "--c-tut" },
  { zh: "行业观察", short: "行业", slug: "industry",      en: "Industry",   colorVar: "--c-industry" },
];

export const CATEGORY_BY_ZH: Map<string, CategoryMeta> = new Map(
  CATEGORIES.map((c) => [c.zh, c]),
);
export const CATEGORY_BY_SLUG: Map<string, CategoryMeta> = new Map(
  CATEGORIES.map((c) => [c.slug, c]),
);

export function categoryRank(zh: string): number {
  const i = CATEGORIES.findIndex((c) => c.zh === zh);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
}

export function categoryColorVar(zh: string): string {
  return CATEGORY_BY_ZH.get(zh)?.colorVar ?? "--muted";
}
