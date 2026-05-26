# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-26<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-26 · 共 3 篇

### 01 · 模型动态 · Model Updates · 3 篇

#### [Qwen3.7-Max 编程能力排名全球第二](https://llmposts.com/models/qwen37-max-code-arena-ranking/)

阿里巴巴 Qwen3.7-Max 在 Code Arena 编程评测中获得 1541 分,排名全球第二并超越 GPT-5.5 与 Gemini-3.5-Flash,支持 35 小时会话中 1,000 次 tool calls。

[阅读全文 →](https://llmposts.com/models/qwen37-max-code-arena-ranking/)

#### [中国扩大民营企业 AI 人才出境限制，要求关键人员出国须获批](https://llmposts.com/models/china-ai-talent-travel-restrictions/)

中国政府于 2026 年 5 月 26 日起扩大对阿里巴巴、DeepSeek 等民营企业顶尖 AI 人才的出境限制，要求关键专业人士出国前须获批准，以防止战略性技术外流。

[阅读全文 →](https://llmposts.com/models/china-ai-talent-travel-restrictions/)

#### [Kimi K2.6 登顶 3D 设计榜单, 性能超越 GPT 5.5 与 Opus 4.7](https://llmposts.com/models/kimi-k2-6-3d-design-leaderboard-champion/)

Kimi K2.6 在 Design Arena 3D 设计排行榜中夺冠,排名较 K2.5 提升 18 位,性能超越 GPT 5.5 和 Opus 4.7 等闭源模型。

[阅读全文 →](https://llmposts.com/models/kimi-k2-6-3d-design-leaderboard-champion/)
<!-- RECENT:END -->

👉 **想看完整内容?全部文章都在 [llmposts.com](https://llmposts.com)**

---

## 📂 历史归档

每天一个文件,当天要闻按分类编号汇总:

<!-- ARCHIVE:START -->
- [`archive/2026/`](archive/2026/) — 2026 年
<!-- ARCHIVE:END -->

> 完整数据见 [`archive/posts.json`](archive/posts.json);归档随时间持续累积,长期保留在 git 历史里。

---

## ℹ️ 关于本仓库

- **是什么** —— [大模型邮报](https://llmposts.com) 的要闻**摘要索引**,不是全文转载。
- **怎么组织的** —— 每天一个文件,顶部带 YAML front matter(`title` / `description` / `date`,`description` 可直接作 SEO meta);当天要闻按分类(模型动态 / 研究前沿 / 工程实践 / 教程指南 / 行业观察)分成编号小节,每节标注篇数。
- **摘要从哪来** —— 直接用文章自己的 Yoast meta description,完整且独立;完整内容(含配图、评论)都在官网,也避免搜索引擎把副本和官网原文相互稀释。
- **怎么更新的** —— GitHub Action 每小时通过 WordPress REST API 检查官网,有新文章就追加进当天归档并刷新本页。工作流见 [`.github/workflows/daily-digest.yml`](.github/workflows/daily-digest.yml)。

## 🌐 关于大模型邮报

[llmposts.com](https://llmposts.com) 是一个中文 AI 资讯站,聚焦大模型动态:

**模型动态** · **研究前沿** · **工程实践** · **教程指南** · **行业观察**

社交媒体(X / Twitter、小红书)入口见 [官网](https://llmposts.com) 页脚。

## ⚙️ 维护者备忘

- 数据源:`scripts/config.mjs` 的 `siteUrl` 指向 llmposts.com,经其 WordPress REST API 抓取。
- 日常无需操作,GitHub Action 每小时自动跑 `generate.mjs`,有新内容才提交。
- 本地手动更新:`npm run generate`(零依赖,只用 Node 内置模块)。
- 一次性回填全部历史文章:`npm run backfill`。
- 全部数据存于 [`archive/posts.json`](archive/posts.json),每日 `.md` 由它生成。
- 分类顺序、英文副标题等都在 [`scripts/config.mjs`](scripts/config.mjs) 调。

---

<sub>本仓库代码可自由使用;要闻内容版权归 <a href="https://llmposts.com">大模型邮报</a> 所有。</sub>
