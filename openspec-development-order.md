# OpenSpec 能力模块与开发顺序

> 更新日期: 2026-02-09

## 模块总览

| 顺序 | Capability | 需求数 | 场景数 | 对应阶段 | 说明 |
|------|-----------|--------|--------|----------|------|
| 1 | **site-foundation** | 8 | 16 | Phase 1 | 主题、布局、导航、性能基线 — 所有模块的基础 |
| 2 | **content-management** | 7 | 10 | Phase 1 | 内容集合、Schema 定义 — 页面内容的基础 |
| 3 | **seo** | 7 | 13 | Phase 1 | Meta、JSON-LD、Sitemap — 与内容同步搭建 |
| 4 | **analytics** | 5 | 9 | Phase 2 | CF Analytics + GA4 — 核心页面上线时接入 |
| 5 | **monetization** | 5 | 8 | Phase 4 | Adsense + 联盟链接 — 有内容后再接入变现 |
| 6 | **site-search** | 3 | 9 | Phase 4 | 站内搜索 — 内容量足够后才有价值 |
| 7 | **newsletter** | 4 | 9 | Phase 4 | 邮件订阅 — 有流量后再做用户留存 |

**合计：7 个模块 · 39 个需求 · 74 个场景**

## 依赖关系

```
site-foundation ──→ content-management ──→ seo
       │                    │
       │                    ├──→ analytics (Phase 2, 随核心页面上线)
       │                    │
       │                    ├──→ monetization (Phase 4)
       │                    │
       │                    ├──→ site-search (Phase 4)
       │                    │
       └────────────────────└──→ newsletter (Phase 4)
```

## 开发阶段映射

### Phase 1: 框架搭建
- `site-foundation` — Astro 项目初始化、深色主题、Tailwind CSS、全局布局组件
- `content-management` — Content Collections schema、Markdown 模板
- `seo` — Meta 组件、JSON-LD、Sitemap、robots.txt

### Phase 2: P0 核心页面 + 分析接入
- `analytics` — Cloudflare Web Analytics + GA4 集成
- 发布 5 个 P0 页面（首页、Is it back、Where to buy、Nutrition、Comparison）

### Phase 3: P1-P2 页面扩展
- 零售商页面模板 + 6 个零售商页面
- 食谱页面模板 + 核心食谱
- 更多对比页面

### Phase 4: 功能完善
- `site-search` — 搜索索引生成 + Workers API + React Island UI
- `newsletter` — 订阅表单 + Workers API + Resend 集成
- `monetization` — Adsense 广告位 + Amazon 联盟链接组件
- P3 深度内容页面

## Spec 文件路径

```
openspec/specs/
├── site-foundation/spec.md
├── content-management/spec.md
├── seo/spec.md
├── analytics/spec.md
├── monetization/spec.md
├── site-search/spec.md
└── newsletter/spec.md
```
