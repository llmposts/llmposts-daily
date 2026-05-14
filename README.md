# 📮 大模型邮报 · AI 要闻汇总

> 持续汇总大模型与 AI 圈的要闻 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**要闻汇总索引**:每天一个文件,当天要闻按分类编号汇总,每条都是「摘要 + 原文链接」。有新文章就自动追加进来。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新。

**最后更新:** <!-- UPDATED:START -->2026-05-14<!-- UPDATED:END -->

---

## 🔥 最近要闻

<!-- RECENT:START -->
- `2026-05-14` [Claude computer use 最佳实践：分辨率配置、思考深度与回放机制](https://llmposts.com/models/claude-computer-use-best-practices/) `模型动态`
- `2026-05-14` [Claude 订阅计划将推 Agent SDK 专属月度额度](https://llmposts.com/models/claude-agent-sdk-monthly-credit/) `模型动态`
- `2026-05-14` [Claude Code 周限额临时提升 50% 至 7 月 13 日](https://llmposts.com/models/claude-code-weekly-limits-increase/) `模型动态`
- `2026-05-14` [Anthropic 收购 Stainless 或达 3 亿美元](https://llmposts.com/models/anthropic-stainless-acquisition/) `模型动态`
- `2026-05-13` [Anthropic 发布 20 余 Claude 法律插件与连接器](https://llmposts.com/models/anthropic-claude-legal-connectors-plugins/) `模型动态`
- `2026-05-13` [吴恩达驳 AI 失业论，预测 AI 就业繁荣即将来临](https://llmposts.com/models/andrew-ng-jobapalooza-prediction/) `模型动态`
- `2026-05-13` [亚马逊 MeshClaw 工具 token 刷量现象引发争议](https://llmposts.com/models/amazon-meshclaw-tool-token-pressure/) `模型动态`
- `2026-05-13` [Claude Opus 4.7 fast mode 开放预览](https://llmposts.com/models/claude-opus-47-fast-mode/) `模型动态`
- `2026-05-13` [Google 重构 AI 指针交互：Gemini 驱动与 Chrome 落地](https://llmposts.com/models/ai-pointer-gemini-chrome/) `模型动态`
- `2026-05-13` [Arena 最新榜单：Claude Opus 4.7 领跑五大前沿模型](https://llmposts.com/models/arena-model-ranking-may-2026/) `模型动态`
- `2026-05-12` [Interfaze 模型发布：融合 CNN 与 Transformer 的精度架构](https://llmposts.com/models/interfaze-model-arch/) `模型动态`
- `2026-05-12` [OpenAI 警告未经授权股权交易](https://llmposts.com/models/openai-unauthorized-equity-transactions/) `模型动态`
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
- **怎么组织的** —— 每天一个文件,顶部带 YAML front matter(`title` / `description` / `date`,`description` 可直接作 SEO meta);当天要闻按分类(模型动态 / 研究前沿 / 教程指南 / 行业观察)分成编号小节,每节标注篇数。
- **为什么只放摘要** —— 摘要帮你快速筛选,完整内容(含配图、评论)都在官网;同时避免搜索引擎把副本和官网原文相互稀释。
- **怎么更新的** —— GitHub Action 每小时检查官网 RSS,有新文章就追加进当天归档并刷新本页。工作流见 [`.github/workflows/daily-digest.yml`](.github/workflows/daily-digest.yml)。

## 🌐 关于大模型邮报

[llmposts.com](https://llmposts.com) 是一个中文 AI 资讯站,聚焦大模型动态:

**模型动态** · **研究前沿** · **教程指南** · **行业观察**

社交媒体(X / Twitter、小红书)入口见 [官网](https://llmposts.com) 页脚。

## ⚙️ 维护者备忘

- 数据源已配好:`scripts/config.mjs` 的 `rssUrl` 指向 `https://llmposts.com/feed/`。
- 日常无需操作,GitHub Action 每小时自动跑 `generate.mjs`,有新内容才提交。
- 本地手动更新:`npm install` 后 `npm run generate`。
- 一次性回填历史文章:`npm run backfill`(走 WordPress REST API)。
- 全部数据存于 [`archive/posts.json`](archive/posts.json),每日 `.md` 由它生成。
- 分类顺序、英文副标题、摘要长度等都在 [`scripts/config.mjs`](scripts/config.mjs) 调。

---

<sub>本仓库代码可自由使用;要闻内容版权归 <a href="https://llmposts.com">大模型邮报</a> 所有。</sub>
