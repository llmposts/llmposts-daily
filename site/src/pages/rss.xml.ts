import type { APIRoute } from "astro";
import { allPosts } from "../lib/data";

function escapeXml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(s: string): string {
  // 用 CDATA 包裹标题/摘要,避免里面的中英文符号触发实体转义噪声
  return `<![CDATA[${String(s).replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function toRfc822(localIso: string): string {
  // posts.json 里的 date 是站点本地时间(如 "2026-05-14T22:22:36"),
  // 没有时区信息。直接当作 UTC 处理(略不准但能用),后续接 cron 时区可以再调。
  const d = new Date(localIso + "Z");
  return d.toUTCString();
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, "") ?? "https://archive.llmposts.com";
  const posts = allPosts().slice(0, 50);

  const items = posts
    .map(
      (p) => `    <item>
      <title>${cdata(p.title)}</title>
      <link>${escapeXml(p.link)}</link>
      <guid isPermaLink="true">${escapeXml(p.link)}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <category>${escapeXml(p.category)}</category>
      <description>${cdata(p.summary)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LLM 日报</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <description>大模型邮报 · 每日 AI 要闻汇总(摘要 + 原文链接,完整文章在官网)</description>
    <language>zh-Hans</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
};
