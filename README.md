# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-17<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-17 · 共 6 篇

### 01 · 模型动态 · Model Updates · 5 篇

#### [Microsoft AI CEO 预警：白领工作或在 18 个月内被 AI 全面自动化](https://llmposts.com/models/microsoft-ai-ceo-white-collar-automation-18-months/)

Microsoft AI CEO Mustafa Suleyman 预测 18 个月内 AI 将全面自动化白领工作，涵盖会计、法律、营销等领域。然而 METR 研究显示 AI 使开发者效率下降 20%，2026 年至今已有 49,135 个 AI 相关岗位被裁。该预测与实体经济数据存在显著落差，实际影响有待验证。

[阅读全文 →](https://llmposts.com/models/microsoft-ai-ceo-white-collar-automation-18-months/)

#### [Grok V9 1.5T 模型或将于夏季发布：xAI 完成基础训练并进入补充训练阶段](https://llmposts.com/models/grok-v9-1-5t-model-summer-release/)

xAI 创始人 Elon Musk 披露 Grok V9 1.5T 模型已完成基础训练，参数量达 1.5T，预计 3 至 4 周后发布。该版本将整合 Cursor 数据进行补充训练，随后进入 SFT 与 RL 阶段。

[阅读全文 →](https://llmposts.com/models/grok-v9-1-5t-model-summer-release/)

#### [GitHub Copilot app 技术预览发布：桌面端 agentic 开发工作流](https://llmposts.com/models/github-copilot-app-technical-preview/)

GitHub 于 2026 年 5 月 14 日发布 Copilot app 技术预览，支持从 issue/PR 启动 agentic 会话、隔离分支工作区与 Agent Merge 自动合并，Pro/Pro+ 订阅者可申请早期访问。

[阅读全文 →](https://llmposts.com/models/github-copilot-app-technical-preview/)

#### [Codex 付费计划用量限制全量重置，OpenAI 补偿 GPT-5.5 异常期损耗](https://llmposts.com/models/codex-gpt-5-5-fix/)

OpenAI 宣布修复 Codex GPT-5.5 模型能力衰减问题，并于 5 月 16 日重置全量付费计划用量限制。此次修复耗时不足 10 小时，涉及底层路由策略优化，直接提振了数百万周活跃用户的代码生成效率。

[阅读全文 →](https://llmposts.com/models/codex-gpt-5-5-fix/)

#### [Claude Mythos 现身 Google Cloud 控制台，Anthropic 或调整访问策略](https://llmposts.com/models/claude-mythos-google-cloud-console-appearance/)

Claude Mythos 被曝现身 Google Cloud 控制台且配置有跨区域配额，该模型此前由 Anthropic 限制仅向 Google、Microsoft 等合作伙伴开放用于防御性漏洞挖掘，社区对其是否会转向更广泛发布存在分歧。

[阅读全文 →](https://llmposts.com/models/claude-mythos-google-cloud-console-appearance/)

### 02 · 工程实践 · Engineering · 1 篇

#### [Claude Code 避坑指南:8 个最容易翻车的使用误区与解法](https://llmposts.com/engineering/claude-code-beginner-pitfalls-guide/)

使用 Claude Code 最容易翻车的 8 个踩坑点:把它当 ChatGPT 用、忽视 /clear、不建 CLAUDE.md、报错只说"修一下"等,每个坑配具体解法,帮新手绕过最常见的失败模式。

[阅读全文 →](https://llmposts.com/engineering/claude-code-beginner-pitfalls-guide/)
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
