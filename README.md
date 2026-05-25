# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-25<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-25 · 共 3 篇

### 01 · 模型动态 · Model Updates · 2 篇

#### [Antigravity 引入 Gemini 3.5 Flash (Low) 档位, 简单任务 token 消耗降低 45%](https://llmposts.com/models/antigravity-gemini-3-5-flash-low-token-optimization/)

Antigravity 推出 Gemini 3.5 Flash (Low) 档位,在简单任务中可比 Medium 档位减少约 45% 的 token 生成量,并重置了所有用户的 Gemini 配额。

[阅读全文 →](https://llmposts.com/models/antigravity-gemini-3-5-flash-low-token-optimization/)

#### [Anthropic 将为 Claude 推出 Memory Files 结构化记忆系统](https://llmposts.com/models/claude-memory-files-dreams-update/)

Anthropic 计划为 Claude 引入 Memory Files 记忆系统,支持按主题存储结构化文档并配合 Dreams 异步整合功能。目前 Dreams 仅在 Opus 4.7 与 Sonnet 4.6 中 beta 测试。

[阅读全文 →](https://llmposts.com/models/claude-memory-files-dreams-update/)

### 02 · 工程实践 · Engineering · 1 篇

#### [Codex 自我审计提示词教程:一键沉淀 Skill 与自动化](https://llmposts.com/guides/codex-self-audit-prompt-guide/)

手把手教你用一条由 OpenAI Codex 团队成员分享、Greg Brockman 转发的提示词,让 Codex 回看会话历史与记忆,自动找出重复工作流并打包成 Skill、Subagent 或 Automation。含使用步骤、调参方法与常见问题。

[阅读全文 →](https://llmposts.com/guides/codex-self-audit-prompt-guide/)
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
