# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-19<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-19 · 共 9 篇

### 01 · 模型动态 · Model Updates · 7 篇

#### [Claude Managed Agents 发布自托管沙箱与 MCP 隧道功能](https://llmposts.com/models/claude-managed-agents-sandbox-mcp-tunnels/)

Anthropic 于 2026 年 5 月 19 日发布 Claude Managed Agents 自托管沙箱与 MCP 隧道功能。Self-hosted sandboxes 进入 public beta，支持 Cloudflare、Daytona、Modal、Vercel 四家提供商；MCP tunnels 处于 research preview，可安全连接私有网络服务。

[阅读全文 →](https://llmposts.com/models/claude-managed-agents-sandbox-mcp-tunnels/)

#### [Claude Code Fast mode 默认启用 Opus 4.7，响应速度提升 2.5 倍](https://llmposts.com/models/claude-code-fast-mode-opus-4-7/)

Claude Code Fast mode 现已默认启用 Opus 4.7，响应速度约为标准模式的 2.5 倍，输入/输出定价均为 30 美元/百万 token，适用于快速迭代与实时调试等延迟敏感场景。

[阅读全文 →](https://llmposts.com/models/claude-code-fast-mode-opus-4-7/)

#### [Manus 发布 Scheduled Tasks 2.0：定时任务进入上下文感知时代](https://llmposts.com/models/manus-scheduled-tasks-2-0-context-aware/)

Manus 于 2025 年 5 月 19 日发布 Scheduled Tasks 2.0，支持在同任务中延续上下文、为 Web 应用配置后台定时操作，并提供独立的调度视图与运行历史追踪。该功能已面向所有用户开放。

[阅读全文 →](https://llmposts.com/models/manus-scheduled-tasks-2-0-context-aware/)

#### [Cursor 发布 Composer 2.5：定向 RL 文本反馈与 Sharded Muon 优化器详解](https://llmposts.com/models/cursor-composer-2-5-targeted-rl-sharded-muon/)

Cursor 发布 Composer 2.5，基于 Kimi K2.5 开源检查点，采用定向 RL 文本反馈与 Sharded Muon 优化器，合成数据扩展 25 倍，输入定价 $0.50/百万 tokens，快速版本 $15/百万输出 tokens。

[阅读全文 →](https://llmposts.com/models/cursor-composer-2-5-targeted-rl-sharded-muon/)

#### [Claude 提示词缓存诊断功能上线：精准定位缓存未命中分歧点](https://llmposts.com/models/claude-prompt-cache-diagnostics-beta/)

Claude 推出 Prompt cache diagnostics 测试版，传入 beta header cache-diagnosis-2026-04-07 与上一条响应 ID 即可对比请求指纹，精准定位模型参数、system prompt、工具或消息历史中的首次分歧点，帮助开发者修复缓存未命中根因。

[阅读全文 →](https://llmposts.com/models/claude-prompt-cache-diagnostics-beta/)

#### [Qwen3.6 MTP GGUF 发布：本地推理 1.4-2.2 倍加速，精度无损](https://llmposts.com/models/qwen3-6-mtp-gguf-speed-up/)

Unsloth 为 Qwen3.6 发布 MTP（Multi Token Prediction）GGUF 量化版本，据官方测试本地推理速度提升 1.4-2.2 倍、精度无损。27B 在 RTX 6000 跑 160 tokens/s，35B-A3B 跑 240 tokens/s。Qwen3.5 全家族也补齐 MTP，已有用户可直接迁移。

[阅读全文 →](https://llmposts.com/models/qwen3-6-mtp-gguf-speed-up/)

#### [Anthropic 收购 Stainless 补强开发者工具链，交易或达 3 亿美元](https://llmposts.com/models/anthropic-acquires-stainless-mcp-sdk/)

Anthropic 于 2026 年 5 月 18 日宣布收购 SDK 工具商 Stainless，交易金额据 The Information 报道或达 3 亿美元。Stainless 将为 Claude 的 MCP 生态与 agent 连接能力提供工具链支持。

[阅读全文 →](https://llmposts.com/models/anthropic-acquires-stainless-mcp-sdk/)

### 02 · 工程实践 · Engineering · 2 篇

#### [让 Codex 形成持续运转的工作循环：4 个核心实践](https://llmposts.com/guides/jason-liu-codex-maxxing-workflow/)

OpenAI Codex 团队工程师 Jason Liu 发布博客 Codex-maxxing，复盘他怎么把 Codex 用成"工作持续运转的地方"。本文拆解其中四个工作流——Heartbeats 自驱动循环、Goals + verification、Memory as files、Steering 边干边说。

[阅读全文 →](https://llmposts.com/guides/jason-liu-codex-maxxing-workflow/)

#### [claude-smart 插件：CC/Codex 自我学习插件，把纠正变成下次会遵守的规则](https://llmposts.com/guides/claude-smart-reflexio-plugin/)

Reflexio 推出 Claude Code 与 Codex 双 host 插件 claude-smart，通过 lifecycle hooks 把纠正和成功路径提炼为规则，在每个新 session 注入回 Claude。完全本地运行，产出 Preferences、Project-specific Skills、Shared Skills 三类产物。

[阅读全文 →](https://llmposts.com/guides/claude-smart-reflexio-plugin/)
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
