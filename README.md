# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-07-01<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-07-01 · 共 5 篇

### 01 · 模型动态 · Model Updates · 5 篇

#### [Anthropic 将删除 Claude Code 中针对中国用户的监控代码](https://llmposts.com/models/claude-code-chinese-user-spyware-removal/)

Anthropic 确认将删除 Claude Code 中针对中国用户的隐藏监控代码。该代码自 3 月起运行，通过注入系统 prompt 收集用户时区和代理信息，预计在明日版本更新中完成回滚。

[阅读全文 →](https://llmposts.com/models/claude-code-chinese-user-spyware-removal/)

#### [Claude Code 被曝植入监测机制, 秘密收集中国用户代理与时区信息](https://llmposts.com/models/claude-code-hidden-monitoring-mechanism/)

Anthropic 的 Claude Code 被曝在 2.1.91 版本起植入监测机制,秘密收集中国用户时区与代理信息以防止蒸馏。负责人 Thariq 确认该实验将在次日版本中完全回滚。

[阅读全文 →](https://llmposts.com/models/claude-code-hidden-monitoring-mechanism/)

#### [Claude Fable 5 明日全球重新上架:软件工程能力显著提升](https://llmposts.com/models/claude-fable-5-redeploy-performance/)

Anthropic 宣布 Claude Fable 5 将于明日全球重新上架。该模型在 5000 万行代码库迁移任务中仅用 1 天完成原本需 2 个月的工作,并在金融推理评测集中获最高分。

[阅读全文 →](https://llmposts.com/models/claude-fable-5-redeploy-performance/)

#### [Anthropic 发布 Claude Sonnet 5: 强化 Agentic 能力且定价更低](https://llmposts.com/models/claude-sonnet-5-agentic-model-release/)

Anthropic 发布 Claude Sonnet 5,强化 agentic 能力以支持自主计划与工具使用。推广期定价为 2 美元/百万 input tokens,性能在多个维度逼近 Opus 4.8。

[阅读全文 →](https://llmposts.com/models/claude-sonnet-5-agentic-model-release/)

#### [Anthropic 发布 Claude Desktop Linux 版 Beta, 支持 Ubuntu 与 Debian](https://llmposts.com/models/claude-desktop-linux-beta-release/)

Anthropic 发布 Claude Desktop Linux 版 Beta,支持 Ubuntu 22.04 和 Debian 12。该版本整合了 Claude Code 与 Cowork 功能,提供可视化 diff 审查与集成终端,但暂不支持 Computer Use 模式。

[阅读全文 →](https://llmposts.com/models/claude-desktop-linux-beta-release/)
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
