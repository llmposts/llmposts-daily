export interface CategoryMeta {
  zh: string;
  slug: string;
  en: string;
  colorVar: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { zh: "模型动态", slug: "model-updates", en: "Model Updates",  colorVar: "--c-model" },
  { zh: "研究前沿", slug: "research",      en: "Research",       colorVar: "--c-research" },
  { zh: "工程实践", slug: "engineering",   en: "Engineering",    colorVar: "--c-eng" },
  { zh: "教程指南", slug: "tutorials",     en: "Tutorials",      colorVar: "--c-tut" },
  { zh: "行业观察", slug: "industry",      en: "Industry Watch", colorVar: "--c-industry" },
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
