// llmposts-daily 配置 —— 一般改这里就够了。
export const config = {
  // llmposts.com 的 RSS feed 地址 —— WordPress 自带,已确认可用。
  //    如需临时覆盖,设置环境变量 RSS_URL 即可。
  rssUrl: process.env.RSS_URL || "https://llmposts.com/feed/",

  siteUrl: "https://llmposts.com",
  siteName: "大模型邮报",

  // 按这个时区划分「每一天」
  timeZone: "Asia/Shanghai",

  // README「最近要闻」展示多少条
  recentCount: 12,

  // 每条摘要最多保留多少字 —— 只做「钩子」,不搬运全文
  summaryMaxLength: 110,
};
