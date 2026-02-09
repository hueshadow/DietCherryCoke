# Diet Cherry Coke 网站 — 技术需求规格

> 基于原需求文档 + 技术栈调整讨论，最终确认版本
> 更新日期: 2026-02-09

---

## 1. 技术架构

### 1.1 技术栈选型

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | Astro | 静态优先、Islands 架构、零 JS 默认、极致性能 |
| CSS | Tailwind CSS | 原子化、体积小、开发效率高 |
| 内容管理 | Markdown/MDX + Astro Content Collections | Git 管理、版本控制、AI 友好 |
| 部署 | Cloudflare Pages | 全球 CDN、免费额度大、自动部署 |
| 动态功能 | Cloudflare Workers | 站内搜索、邮件订阅等后端逻辑 |
| 邮件服务 | Resend | 现代 API、开发者友好、免费额度够用 |
| 数据分析 | Cloudflare Web Analytics + GA4 | 双重分析：CF 看流量、GA4 看转化 |
| 搜索 | Cloudflare Workers | 轻量级全文搜索 |

### 1.2 项目结构（预期）

```
dietcherrycoke/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── layout/       # Header, Footer, Nav, Sidebar
│   │   ├── seo/          # JsonLd, OpenGraph, Meta
│   │   ├── content/      # ArticleCard, NutritionTable, ComparisonTable
│   │   ├── ads/          # AdsenseSlot, AffiliateLink
│   │   └── ui/           # Button, SearchBar, NewsletterForm
│   ├── layouts/          # 页面布局模板
│   │   ├── BaseLayout.astro
│   │   ├── ArticleLayout.astro
│   │   └── LandingLayout.astro
│   ├── pages/            # 路由页面
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── is-it-back.astro
│   │   ├── where-to-buy/
│   │   ├── nutrition/
│   │   ├── recipes/
│   │   ├── compare/
│   │   └── ...
│   ├── content/          # Markdown 内容集合
│   │   ├── articles/
│   │   ├── recipes/
│   │   └── reviews/
│   ├── styles/           # 全局样式
│   │   └── global.css
│   └── utils/            # 工具函数
│       ├── seo.ts
│       └── schema.ts
├── public/               # 静态资源
│   ├── images/
│   ├── favicon.ico
│   └── robots.txt
├── workers/              # Cloudflare Workers
│   ├── search.ts         # 站内搜索
│   └── subscribe.ts      # 邮件订阅
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 2. 设计规范

### 2.1 设计风格
- **主题**: 深色主题（Dark Mode）
- **参考**: factory.ai 的 AI 原生风格
- **特征**: 极简、技术感、网格布局、微妙动画、高信息密度

### 2.2 配色方案

| 用途 | 颜色 | 说明 |
|------|------|------|
| 背景主色 | `#0a0a0a` ~ `#1a1a1a` | 深色背景 |
| 背景次色 | `#1f1f1f` ~ `#2a2a2a` | 卡片/区块背景 |
| 文字主色 | `#f5f5f5` | 高对比度白色文字 |
| 文字次色 | `#a0a0a0` | 次要信息灰色 |
| 强调色 | `#e61e2b` | 可口可乐红（CTA、链接、高亮） |
| 强调色悬停 | `#ff2d3a` | 红色亮色变体 |
| 边框色 | `#333333` | 微妙分隔线 |

### 2.3 排版

- **标题字体**: Inter / System UI（无衬线、现代感）
- **正文字体**: Inter / System UI
- **代码/数据**: JetBrains Mono（营养成分表等数据展示）
- **行高**: 1.6（正文）、1.2（标题）
- **最大内容宽度**: 1200px

### 2.4 布局
- 12 列网格系统（Tailwind Grid）
- 移动端 4 列，平板 8 列，桌面 12 列
- 响应式断点: sm(640px), md(768px), lg(1024px), xl(1280px)

### 2.5 动画
- 过渡时长: 200-300ms
- 链接下划线展开动画
- 页面切换淡入效果
- 滚动触发的渐显动画（轻量级）

---

## 3. 页面结构

### 3.1 全局组件
- **Header**: Logo + 主导航 + 搜索入口 + 深色主题标识
- **Footer**: 站点链接 + 免责声明 + 社交媒体 + Newsletter 订阅
- **Sidebar**（文章页）: 目录导航 + 相关文章 + 广告位
- **Breadcrumb**: 面包屑导航（SEO 友好）

### 3.2 页面清单（沿用原文档优先级）

#### P0 — 第一周核心页面
| 页面 | URL | 类型 |
|------|-----|------|
| 首页 | `/` | Landing |
| Is It Back? | `/is-it-back` | 信息页 |
| Where to Buy | `/where-to-buy` | 购买指南 |
| Nutrition Facts | `/nutrition` | 数据页 |
| vs Diet Coke | `/compare/diet-cherry-coke-vs-diet-coke` | 对比页 |

#### P1 — 第二周零售商页面
| 页面 | URL |
|------|-----|
| Walmart | `/where-to-buy/walmart` |
| Kroger | `/where-to-buy/kroger` |
| Target | `/where-to-buy/target` |
| Amazon | `/where-to-buy/amazon` |
| Walgreens | `/where-to-buy/walgreens` |
| CVS | `/where-to-buy/cvs` |

#### P2 — 第三周食谱和对比
| 页面 | URL |
|------|-----|
| Recipes Hub | `/recipes` |
| Cherry Cola Float | `/recipes/cherry-cola-float` |
| BBQ Sauce | `/recipes/bbq-sauce` |
| Cocktails | `/recipes/cocktails` |
| vs Cherry Coke Zero | `/compare/diet-cherry-coke-vs-cherry-coke-zero` |
| vs Cherry Pepsi | `/compare/diet-cherry-coke-vs-cherry-pepsi` |

#### P3 — 第四周深度内容
| 页面 | URL |
|------|-----|
| History | `/history` |
| Reviews | `/reviews` |
| Caffeine Content | `/nutrition/caffeine` |
| Ingredients | `/nutrition/ingredients` |
| FAQ | `/faq` |
| 更多食谱和对比页面 | ... |

---

## 4. 功能模块

### 4.1 SEO 基础设施
- 每页自动生成 `<title>`, `<meta description>`, canonical URL
- JSON-LD 结构化数据 (Article, FAQ, Product, Recipe, BreadcrumbList)
- Open Graph + Twitter Cards meta tags
- 自动生成 sitemap.xml
- robots.txt 配置
- Google Search Console 验证

### 4.2 广告/联盟变现
- Google Adsense 广告位（文章顶部、中部、侧边栏）
- Amazon 联盟链接组件（带 nofollow + sponsored 标记）
- 广告位可通过 frontmatter 控制显示/隐藏

### 4.3 邮件订阅
- Newsletter 订阅表单（Footer + 独立组件）
- Cloudflare Worker 处理订阅请求
- Resend API 发送确认邮件
- 订阅者数据存储（Cloudflare KV 或 D1）

### 4.4 站内搜索
- 构建时生成搜索索引
- Cloudflare Worker 提供搜索 API
- 前端搜索组件（React Island）
- 支持关键词高亮

### 4.5 数据分析
- Cloudflare Web Analytics（无 cookie、隐私友好）
- Google Analytics 4（转化追踪、用户行为分析）
- Google Search Console（搜索表现监控）

---

## 5. 内容生产流程

1. **AI 生成初稿**: 使用 Claude/AI 根据关键词和大纲生成 Markdown 内容
2. **人工审核**: 检查事实准确性、语言质量、SEO 优化
3. **Git 提交**: 审核通过后提交到 content/ 目录
4. **自动部署**: Cloudflare Pages 自动构建和部署

---

## 6. 开发阶段

### Phase 1: 框架搭建
- [ ] Astro 项目初始化 + Tailwind CSS 配置
- [ ] 深色主题设计系统（颜色、排版、间距）
- [ ] 全局布局组件（Header, Footer, Sidebar）
- [ ] SEO 基础组件（Meta, JsonLd, OpenGraph）
- [ ] Content Collections schema 定义
- [ ] Cloudflare Pages 部署配置

### Phase 2: P0 核心页面
- [ ] 首页设计和实现
- [ ] Is It Back 页面
- [ ] Where to Buy 页面
- [ ] Nutrition Facts 页面
- [ ] 对比页面模板 + Diet Cherry Coke vs Diet Coke

### Phase 3: P1-P2 页面扩展
- [ ] 零售商页面模板 + 6 个零售商页面
- [ ] 食谱页面模板 + 核心食谱
- [ ] 更多对比页面

### Phase 4: 功能完善
- [ ] 站内搜索（Worker + React Island）
- [ ] 邮件订阅（Worker + Resend）
- [ ] Google Adsense 集成
- [ ] Amazon 联盟链接组件
- [ ] P3 深度内容页面
- [ ] 性能优化和 Core Web Vitals 调优
