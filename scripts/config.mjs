// llmposts-daily 配置 —— 一般改这里就够了。
export const config = {
  siteUrl: "https://llmposts.com",
  siteName: "大模型邮报",

  // 每个归档文件 front matter 里 meta description 的最大字数
  metaDescriptionMaxLength: 150,

  // 简报里分类小节的排序;不在表里的分类排到最后
  categoryOrder: ["模型动态", "研究前沿", "工程实践", "教程指南", "行业观察"],

  // 分类的英文副标题(可选;没列出的分类只显示中文)
  categoryLabels: {
    模型动态: "Model Updates",
    研究前沿: "Research",
    工程实践: "Engineering",
    教程指南: "Tutorials",
    行业观察: "Industry Watch",
  },
};
