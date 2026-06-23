# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-06-23<!-- UPDATED:END -->

---

<!-- RECENT:START -->
## 🔥 最新汇总 · 2026-06-23 · 共 4 篇

### 01 · 模型动态 · Model Updates · 4 篇

#### [GPT-5.6 系列发布或延期至 7 月中旬，Pro 版推理强度提升至 960](https://llmposts.com/models/gpt-5-6-release-delay-leak/)

GPT-5.6 系列发布时间或延期至 7 月中旬。爆料显示 GPT-5.6 Pro 推理强度提升至 960，知识截止日期更新至 2025 年 12 月，并增强了 SVG 生成与 Playwright 自动化支持。

[阅读全文 →](https://llmposts.com/models/gpt-5-6-release-delay-leak/)

#### [Anthropic 或将为移动端推出 Cowork 支持, 实现云端任务调度](https://llmposts.com/models/anthropic-cowork-mobile-support-leak/)

Anthropic 计划在 iOS 应用中推出 Cowork 移动端支持,将任务执行迁移至云端以解除本地硬件依赖。最新构建版本显示支持跨平台调度,且语音模式或将支持模型选择,预计 2026 年 6 月底发布。

[阅读全文 →](https://llmposts.com/models/anthropic-cowork-mobile-support-leak/)

#### [OpenAI 拟推出 GPT-Bidi-1 双向音频模型升级 ChatGPT 语音模式](https://llmposts.com/models/chatgpt-gpt-bidi-1-voice-upgrade/)

OpenAI 计划推出 GPT-Bidi-1 双向音频模型，升级 ChatGPT 语音模式以支持实时中断响应，并提供 High、Medium、Instant 三档推理级别。

[阅读全文 →](https://llmposts.com/models/chatgpt-gpt-bidi-1-voice-upgrade/)

#### [GLM-5.2 领跑开源权重模型,GDPval-AA 智能体评测位列全球第三](https://llmposts.com/models/glm-5-2-gdpval-aa-benchmark-performance/)

智谱 AI 的 GLM-5.2 在 GDPval-AA 智能体评测中获得 1524 Elo 分数,位列全球第三,大幅领先 MiniMax-M3 等开源模型。

[阅读全文 →](https://llmposts.com/models/glm-5-2-gdpval-aa-benchmark-performance/)
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
