# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-23<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-05-23 · 共 7 篇

### 01 · 模型动态 · Model Updates · 7 篇

#### [GPT-5.6 泄露：六月发布在即，iris-alpha 等三款变体曝光](https://llmposts.com/models/gpt-5-6-leak-june-2025/)

据 X 平台科技博主 Pankaj Kumar 最新 GPT-5.6 泄露信息，OpenAI 或于六月发布 GPT-5.6 与 GPT-5.6 Pro，含 iris-alpha 等三款变体，Sonnet 4.8 与 Gemini 3.5 Pro 也预计同期发布。

[阅读全文 →](https://llmposts.com/models/gpt-5-6-leak-june-2025/)

#### [约 10% 的 Codex 流量转向 Pi Harness 与 OpenCode](https://llmposts.com/models/openai-codex-open-source-traffic/)

OpenAI Codex 流量分配出现新动向，团队工程师披露约 10% 生产流量流转至 Pi 与 OpenCode。得益于开放 app server 与 SDK，开发者复用 ChatGPT 账号免额外成本。

[阅读全文 →](https://llmposts.com/models/openai-codex-open-source-traffic/)

#### [DeepSeek-V4-Pro 永久降价, 折后价成常态](https://llmposts.com/models/deepseek-v4-pro-permanent-price-cut/)

DeepSeek 宣布 DeepSeek-V4-Pro 永久降价，2026 年 5 月 31 日结束 2.5 折优惠后执行折后价，输入 3 元/百万 token、输出 6 元/百万 token，相当于原价 25%，Flash 版同步登顶 OpenRouter 周榜

[阅读全文 →](https://llmposts.com/models/deepseek-v4-pro-permanent-price-cut/)

#### [ChatGPT PowerPoint 集成上线，支持直接创建编辑演示文稿](https://llmposts.com/models/chatgpt-powerpoint-integration/)

OpenAI 于 2026 年 5 月推出 ChatGPT for PowerPoint 测试版，该 ChatGPT PowerPoint 集成功能支持在演示软件中直接以自然语言创建、编辑和分析演示文稿，覆盖 Business、Enterprise、Free 等全部用户层级并内置图片生成。

[阅读全文 →](https://llmposts.com/models/chatgpt-powerpoint-integration/)

#### [Claude Mythos Preview 漏洞挖掘成果:Project Glasswing 首月发现逾万高危漏洞](https://llmposts.com/models/project-glasswing-claude-mythos-preview-vulnerabilities/)

Anthropic Project Glasswing 首月报告显示，Claude Mythos Preview 漏洞挖掘能力已发现超万枚高危严重漏洞，Cloudflare 确认 2,000 枚含 400 枚高危，开源项目 1,752 枚评估准确率达 90.6%

[阅读全文 →](https://llmposts.com/models/project-glasswing-claude-mythos-preview-vulnerabilities/)

#### [Claude Sonnet 4.8 泄露:Anthropic 或跳过 4.7 升级视觉与编码](https://llmposts.com/models/claude-sonnet-4-8-leak/)

Anthropic 的 Claude Sonnet 4.8 泄露事件由 Claude Code npm 更新意外曝光,源码包含 512,000 行调试信息。新模型或跳过 Sonnet 4.7,视觉准确率超 98%,引入 X high 推理层级,预计 2026 年 6 月中下旬发布。

[阅读全文 →](https://llmposts.com/models/claude-sonnet-4-8-leak/)

#### [Anthropic 超 300 亿美元融资即将收官，估值逾 9000 亿美元超越 OpenAI](https://llmposts.com/models/anthropic-30-billion-funding-round/)

Anthropic 即将完成超 300 亿美元融资，估值逾 9000 亿美元超越 OpenAI 成为全球最高估值 AI 初创。红杉等机构各投约 20 亿美元，Q2 收入预计 109 亿美元，年化收入即将突破 500 亿美元，公司有望首次实现盈利。

[阅读全文 →](https://llmposts.com/models/anthropic-30-billion-funding-round/)
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
