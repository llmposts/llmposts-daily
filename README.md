# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-14<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-14 · 共 6 篇

### 01 · 模型动态 · Model Updates · 6 篇

#### [OpenAI Codex 企业推广：签约企业即送 2 个月免费额度](https://llmposts.com/models/openai-codex-enterprise-promo/)

OpenAI 宣布针对计划切换的企业客户提供激励政策。签约即送 2 个月免费 OpenAI Codex 企业推广额度。活动持续至 6 月中旬，旨在与 Anthropic 争夺开发者市场。

[阅读全文 →](https://llmposts.com/models/openai-codex-enterprise-promo/)

#### [OpenAI 重构 Windows 平台 Codex 沙箱实现方案](https://llmposts.com/models/codex-windows-sandbox-implementation/)

OpenAI 详细公开了 Codex 编码智能体在 Windows 平台的沙箱实现路径。该方案历经非提权与提权架构迭代，通过合成 SID、受限 token 与专属防火墙规则，在保障系统隔离的同时保留了智能体对开发者环境的读写兼容性。

[阅读全文 →](https://llmposts.com/models/codex-windows-sandbox-implementation/)

#### [Claude computer use 最佳实践：分辨率配置、思考深度与回放机制](https://llmposts.com/models/claude-computer-use-best-practices/)

Anthropic 正式公布 Claude computer use 最佳实践，明确 1280x720 默认配置与 3.75M 像素硬性上限，完整拆解点击精度对齐、自适应思考阈值调度及工作流录制回放架构。

[阅读全文 →](https://llmposts.com/models/claude-computer-use-best-practices/)

#### [Claude 订阅计划将推 Agent SDK 专属月度额度](https://llmposts.com/models/claude-agent-sdk-monthly-credit/)

6 月 15 日起 Claude 订阅套餐将引入 Claude Agent SDK 月度额度，Pro 套餐 $20 起，隔离交互与程序化计费，规避自动化脚本抢占订阅限额。

[阅读全文 →](https://llmposts.com/models/claude-agent-sdk-monthly-credit/)

#### [Claude Code 周限额临时提升 50% 至 7 月 13 日](https://llmposts.com/models/claude-code-weekly-limits-increase/)

Anthropic 宣布 Claude Code 周使用限额临时提升 50%，覆盖 Pro、Max、Team 及企业用户，有效期至 7 月 13 日，可与上周 2 倍时长上限叠加生效。

[阅读全文 →](https://llmposts.com/models/claude-code-weekly-limits-increase/)

#### [Anthropic 收购 Stainless 或达 3 亿美元](https://llmposts.com/models/anthropic-stainless-acquisition/)

Anthropic 收购 Stainless 的谈判被曝进入后期，The Information 称金额至少 3 亿美元；Stainless 为 OpenAI、谷歌和 Anthropic 提供 SDK、API 文档与 agent 接口。

[阅读全文 →](https://llmposts.com/models/anthropic-stainless-acquisition/)
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
