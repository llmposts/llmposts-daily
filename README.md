# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-06-07<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-06-07 · 共 3 篇

### 01 · 模型动态 · Model Updates · 3 篇

#### [谷歌每月支付 9.2 亿美元租用 SpaceX 算力以支持 Gemini agent 平台](https://llmposts.com/models/google-spacex-compute-deal-gpu/)

谷歌与 SpaceX 达成协议,每月支付 9.2 亿美元租用 11 万块 NVIDIA GPU,租期从 2026 年 10 月至 2029 年 6 月,旨在支持 Gemini Enterprise 的 agent 平台需求。

[阅读全文 →](https://llmposts.com/models/google-spacex-compute-deal-gpu/)

#### [OpenAI 计划对 ChatGPT 进行最大规模重组, 将其转型为超级应用](https://llmposts.com/models/openai-chatgpt-superapp-overhaul-ipo/)

OpenAI 计划将 ChatGPT 转型为集成编程工具与 AI agents 的超级应用,以提升高利润产品占比。目前企业客户贡献约 40% 营收,Codex 周活用户已超 500 万,旨在为今年 IPO 驱动增长。

[阅读全文 →](https://llmposts.com/models/openai-chatgpt-superapp-overhaul-ipo/)

#### [Anthropic 披露 AI 递归自我改进趋势:代码产出增 8 倍, 正逐步接管自身研发](https://llmposts.com/models/anthropic-recursive-self-improvement-report/)

Anthropic 披露 AI 正在加速自身开发,工程师代码产出达以往 8 倍,且 80% 以上代码由 Claude 编写。报告探讨了递归自我改进的路径,指出任务处理时长每 4 个月翻倍,并警示完全自主迭代模型带来的对齐风险。

[阅读全文 →](https://llmposts.com/models/anthropic-recursive-self-improvement-report/)
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
