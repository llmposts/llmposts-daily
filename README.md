# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-28<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-28 · 共 6 篇

### 01 · 模型动态 · Model Updates · 6 篇

#### [OpenRouter 完成 1.13 亿美元 B 轮融资, 构建多模型路由网关层](https://llmposts.com/models/openrouter-series-b-funding-infrastructure/)

OpenRouter 完成 1.13 亿美元 B 轮融资,由 CapitalG 领投。平台周处理量已达 25 万亿 token,服务 800 万开发者,定位为多模型 AI 时代的路由与网关层。

[阅读全文 →](https://llmposts.com/models/openrouter-series-b-funding-infrastructure/)

#### [Claude Voice Mode 或将支持中文，新增 Push-to-Talk 模式](https://llmposts.com/models/claude-voice-mode-chinese-language-support/)

Anthropic 计划为 Claude Voice Mode 增加中文等多国语言支持，并引入 push-to-talk 模式。该更新预计将通过升级编排层实现多语言切换，以对标 ChatGPT 与 Gemini 的语音能力。

[阅读全文 →](https://llmposts.com/models/claude-voice-mode-chinese-language-support/)

#### [Claude Code 更新：优化全屏渲染与 MCP 稳定性, 引入流式思考输出](https://llmposts.com/models/claude-code-reliability-update-may-2026/)

Claude Code 于 2026 年 5 月 28 日发布更新,重点修复 TUI 闪烁、优化 MCP 连接稳定性并引入流式 Thinking 输出,解决会话崩溃等可靠性问题。

[阅读全文 →](https://llmposts.com/models/claude-code-reliability-update-may-2026/)

#### [LLM Sleep 机制发布：通过类睡眠离线递归提升长上下文推理](https://llmposts.com/models/llm-sleep-offline-recurrence-memory/)

卡内基梅隆大学等机构提出 LLM Sleep 机制,通过 N 次离线递归将上下文转换为持久权重,解决 Transformer 长上下文推理瓶颈,并在 GSM-Infinite 等任务中验证有效性。

[阅读全文 →](https://llmposts.com/models/llm-sleep-offline-recurrence-memory/)

#### [Claude Code 推出 /workflows 功能:用代码逻辑替代 LLM 编排](https://llmposts.com/models/claude-code-workflows-multi-agent-orchestration/)

Anthropic 在 Claude Code 2.1.147 版本中推出 /workflows 功能,利用 JS 代码替代 LLM 编排以降低 token 消耗,目前该功能疑似已被暂时下线。

[阅读全文 →](https://llmposts.com/models/claude-code-workflows-multi-agent-orchestration/)

#### [OpenAI 将于 6 月 2 日在 Codex 中停用 GPT-5.2 与 GPT-5.3-Codex](https://llmposts.com/models/openai-codex-gpt-5-2-5-3-sunset/)

OpenAI 宣布将于 2026 年 6 月 2 日在 Codex 中停用 GPT-5.2 和 GPT-5.3-Codex。免费用户将默认切换至 GPT-5.5,但 API 渠道仍可继续使用旧版本。

[阅读全文 →](https://llmposts.com/models/openai-codex-gpt-5-2-5-3-sunset/)
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
