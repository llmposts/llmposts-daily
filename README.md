# 📮 大模型邮报 · 每日 AI 要闻

> 每天精选大模型与 AI 圈的要闻摘要 —— **完整文章请移步官网** 👉 **https://llmposts.com**

[![website](https://img.shields.io/badge/官网-llmposts.com-2563eb)](https://llmposts.com)

这里是 [大模型邮报](https://llmposts.com) 的**每日要闻索引**:每条都是「摘要 + 原文链接」,方便你快速扫一眼、感兴趣再点进去读全文。

⭐ 觉得有用就点个 Star,点 **Watch** 关注更新 —— 内容每天自动刷新。

**最后更新:** <!-- UPDATED:START -->2026-05-14<!-- UPDATED:END -->

---

## 🔥 最近要闻

<!-- RECENT:START -->
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
<!-- RECENT:END -->

👉 **想看完整内容?全部文章都在 [llmposts.com](https://llmposts.com)**

---

## 📂 历史归档

按日期归档,每天一个文件:

- [`archive/2026/`](archive/2026/) — 2026 年

> 仓库会随时间持续累积归档;文件一旦生成就长期保留在 git 历史里。

---

## ℹ️ 关于本仓库

- **是什么** —— [大模型邮报](https://llmposts.com) 的每日要闻**摘要索引**,不是全文转载。
- **为什么只放摘要** —— 摘要帮你快速筛选,完整内容(含配图、评论)都在官网;同时避免搜索引擎把副本和官网原文相互稀释。
- **怎么更新的** —— GitHub Action 每天定时抓取官网 RSS,自动生成当天归档并刷新本页「最近要闻」。工作流见 [`.github/workflows/daily-digest.yml`](.github/workflows/daily-digest.yml)。

## 🌐 关于大模型邮报

[llmposts.com](https://llmposts.com) 是一个中文 AI 资讯站,聚焦大模型动态:

**模型动态** · **研究前沿** · **教程指南** · **行业观察**

社交媒体(X / Twitter、小红书)入口见 [官网](https://llmposts.com) 页脚。

## ⚙️ 维护者备忘

首次启用两步:

1. **给官网加 RSS**,拿到 feed 地址(例如 `https://llmposts.com/rss.xml`)。
2. 把地址填进 [`scripts/config.mjs`](scripts/config.mjs) 的 `rssUrl`,或设为仓库变量 `RSS_URL`。

之后 Action 全自动接管。本地手动跑一次:

```bash
npm install
npm run generate
```

---

<sub>本仓库代码可自由使用;要闻内容版权归 <a href="https://llmposts.com">大模型邮报</a> 所有。</sub>
