# Diet Cherry Coke — SEO 驱动的网站需求开发文档

> 项目代号：DCC (Diet Cherry Coke)
> 版本：v1.0
> 日期：2026-02-09

---

## 一、项目概述

### 1.1 项目目标

基于 "diet cherry coke" 关键词（Ahrefs KD=0）的 SEO 机会，搭建一个垂直信息站，目标在 3 个月内进入 Google 前 10，6 个月内实现月流量 2-5 万，通过广告和联盟佣金变现。

### 1.2 项目定位

| 维度 | 定义 |
|------|------|
| 网站类型 | 垂直信息站（博客 + 工具） |
| 目标用户 | Diet Cherry Coke 爱好者、购买者、食谱爱好者 |
| 核心价值 | 全网最全的 Diet Cherry Coke 信息聚合 |
| 语言 | 英文（主站）+ 后期考虑多语言 |
| 域名 | dietcherrycokeguide.com（首选，需确认可用性） |

> **注意：dietcherrycoke.com 已被可口可乐公司持有（2002 年注册），不可获取。**
> 备选域名：dietcherrycokefinder.com、dietcokecherry.com、cherrycokeworld.com、dietcherrycokerecipes.com
> 注册前需逐一检查可用性。

### 1.3 技术选型

| 组件 | 选择 | 理由 |
|------|------|------|
| CMS | WordPress | 哥飞案例推荐，SEO 生态成熟，插件丰富 |
| 主题 | GeneratePress / Astra | 轻量、速度快、SEO 友好 |
| 主机 | Cloudways / SiteGround | 性能好、全球 CDN |
| SEO 插件 | Rank Math Pro | Schema 标记、Sitemap、On-Page SEO |
| 缓存 | WP Rocket | 页面速度优化 |
| 图片 | ShortPixel | 图片压缩、WebP 转换 |
| 分析 | Google Analytics 4 + GSC | 流量监控、排名追踪 |

---

## 二、网站架构设计

### 2.1 URL 结构规范

```
域名：dietcherrycoke.com
URL 格式：全部小写，单词用连字符分隔
层级：最多 2 层（/category/page/）
```

### 2.2 页面清单与开发优先级

#### P0 — 第一周上线（核心页面）

| # | URL | 页面标题 (Title Tag) | H1 | 目标关键词 | 页面类型 |
|---|-----|---------------------|-----|-----------|----------|
| 1 | `/` | Diet Cherry Coke — The Complete Guide (2026) | Everything About Diet Cherry Coke | diet cherry coke | 长文指南 |
| 2 | `/is-it-back/` | Is Diet Cherry Coke Back? 2026 Comeback Status | Is Diet Cherry Coke Back in 2026? | is diet cherry coke back, diet cherry coke 2026 | 追踪页 |
| 3 | `/where-to-buy/` | Where to Buy Diet Cherry Coke — Store Finder & Guide | Where to Buy Diet Cherry Coke | diet cherry coke where to buy | 聚合指南 |
| 4 | `/nutrition/` | Diet Cherry Coke Nutrition Facts: Calories, Caffeine & More | Diet Cherry Coke Nutrition Facts | diet cherry coke nutrition facts | 数据页 |
| 5 | `/vs/coke-zero-cherry/` | Diet Cherry Coke vs Coke Zero Cherry — Full Comparison | Diet Cherry Coke vs Coke Zero Cherry | diet cherry coke vs coke zero cherry | 对比页 |

#### P1 — 第二周上线（扩展页面）

| # | URL | 页面标题 | 目标关键词 | 页面类型 |
|---|-----|---------|-----------|----------|
| 6 | `/where-to-buy/walmart/` | Diet Cherry Coke at Walmart — Price, Stock & Sizes | diet cherry coke walmart | 零售商页 |
| 7 | `/where-to-buy/kroger/` | Diet Cherry Coke at Kroger — Availability & Price | diet cherry coke kroger | 零售商页 |
| 8 | `/where-to-buy/target/` | Diet Cherry Coke at Target — Where to Find It | diet cherry coke target | 零售商页 |
| 9 | `/where-to-buy/amazon/` | Buy Diet Cherry Coke on Amazon — Best Deals | diet cherry coke amazon | 零售商页 |
| 10 | `/where-to-buy/near-me/` | Diet Cherry Coke Near Me — Store Locator | diet cherry coke near me | 工具页 |
| 11 | `/nutrition/calories/` | How Many Calories in Diet Cherry Coke? | diet cherry coke calories | 数据页 |
| 12 | `/nutrition/caffeine/` | Diet Cherry Coke Caffeine Content — How Much? | diet cherry coke caffeine | 数据页 |
| 13 | `/nutrition/ingredients/` | Diet Cherry Coke Ingredients — Full List Explained | diet cherry coke ingredients | 数据页 |

#### P2 — 第三周上线（食谱 + 对比）

| # | URL | 页面标题 | 目标关键词 | 页面类型 |
|---|-----|---------|-----------|----------|
| 14 | `/recipes/` | Best Diet Cherry Coke Recipes — Cocktails, Floats & More | diet cherry coke recipes | 聚合页 |
| 15 | `/recipes/cocktails/` | 10 Best Diet Cherry Coke Cocktail Recipes | diet cherry coke cocktail | 食谱页 |
| 16 | `/recipes/dirty-coke/` | Dirty Diet Cherry Coke Recipe — The Viral TikTok Drink | dirty diet cherry coke | 食谱页 |
| 17 | `/recipes/float/` | Diet Cherry Coke Float — Classic Recipe & Variations | diet cherry coke float | 食谱页 |
| 18 | `/vs/cherry-coke/` | Diet Cherry Coke vs Cherry Coke — What's the Difference? | diet cherry coke vs cherry coke | 对比页 |
| 19 | `/vs/diet-dr-pepper/` | Diet Cherry Coke vs Diet Dr Pepper Cherry | diet cherry coke vs diet dr pepper | 对比页 |
| 20 | `/vs/diet-coke/` | Diet Cherry Coke vs Diet Coke — Taste & Nutrition | diet cherry coke vs diet coke | 对比页 |

#### P3 — 第四周上线（深度内容）

| # | URL | 页面标题 | 目标关键词 | 页面类型 |
|---|-----|---------|-----------|----------|
| 21 | `/history/` | The Complete History of Diet Cherry Coke (1985-2026) | diet cherry coke history | 长文 |
| 22 | `/discontinued/` | Why Was Diet Cherry Coke Discontinued? The Full Story | diet cherry coke discontinued | 长文 |
| 23 | `/review/` | Diet Cherry Coke Review — Honest Taste Test & Rating | diet cherry coke review | 评测页 |
| 24 | `/recipes/cake/` | Diet Cherry Coke Cake — Easy Recipe | diet cherry coke cake | 食谱页 |
| 25 | `/recipes/jello/` | Diet Cherry Coke Jello — Fun Party Recipe | diet cherry coke jello | 食谱页 |
| 26 | `/recipes/marinade/` | Diet Cherry Coke BBQ Marinade — Secret Sauce Recipe | diet cherry coke marinade | 食谱页 |
| 27 | `/recipes/homemade/` | How to Make Diet Cherry Coke at Home | homemade diet cherry coke | 食谱页 |
| 28 | `/price/` | Diet Cherry Coke Price — 12-Pack, 20oz & 2L Compared | diet cherry coke price | 数据页 |
| 29 | `/where-to-buy/uk/` | Diet Cherry Coke UK — Where to Buy & Availability | diet cherry coke uk | 地区页 |
| 30 | `/where-to-buy/online/` | Buy Diet Cherry Coke Online — Best Options | buy diet cherry coke online | 聚合页 |

---

## 三、页面模板规范

### 3.1 通用 SEO 规范

| 元素 | 规范 |
|------|------|
| Title Tag | 50-60 字符，主关键词靠前，含品牌名或年份 |
| Meta Description | 150-160 字符，含主关键词，有行动号召 |
| H1 | 每页唯一，含主关键词，与 Title 略有不同 |
| H2/H3 | 含长尾关键词或 PAA 问题 |
| URL | 简短、含关键词、全小写、连字符分隔 |
| 图片 Alt | 描述性文字，含关键词变体 |
| 内链 | 每篇文章至少 3-5 个内链到相关页面 |
| 外链 | 引用权威来源（coca-cola.com、wikipedia 等） |
| 字数 | 核心页面 1500-3000 词，食谱页 800-1500 词 |

### 3.2 页面模板 A — 综合指南页（首页、/is-it-back/）

```
[Hero Section]
├── H1 标题
├── 更新日期标记（"Last Updated: Feb 9, 2026"）
├── 关键信息摘要卡片（Key Facts Box）
└── 目录（Table of Contents）

[正文内容]
├── 概述段落（含主关键词，前 100 词内）
├── H2 章节 × 5-8 个
│   ├── 每个 H2 下 2-3 个 H3
│   ├── 原创图片（产品实拍）
│   └── 信息表格/对比表
├── FAQ Section（针对 People Also Ask）
└── 相关文章推荐（内链模块）

[侧边栏]
├── 快速导航
├── "Where to Buy" CTA 按钮
└── 社交媒体关注入口

[底部]
├── 作者信息（E-E-A-T）
├── 来源引用
└── 评论区
```

### 3.3 页面模板 B — 购买指南页（/where-to-buy/ 系列）

```
[Hero Section]
├── H1 标题
├── 更新日期
└── 快速回答卡片（"Yes, Diet Cherry Coke is available at..."）

[Store Locator 工具]（如技术可行）
├── 输入邮编/城市
└── 显示附近有货的商店

[零售商列表]
├── 每个零售商一个卡片
│   ├── 商店名称 + Logo
│   ├── 有货状态（In Stock / Out of Stock）
│   ├── 价格信息
│   ├── 可购买规格（12-pack, 20oz, 2L）
│   └── 购买链接（Affiliate Link）
├── 线上购买渠道
└── 价格对比表

[FAQ Section]
[相关文章推荐]
```

### 3.4 页面模板 C — 对比页（/vs/ 系列）

```
[Hero Section]
├── H1 标题（"X vs Y — Full Comparison"）
├── 对比摘要卡片（Winner 标记）
└── 目录

[并排对比表]
├── 口味
├── 卡路里
├── 咖啡因
├── 甜味剂
├── 价格
├── 可购买性
└── 总评分

[详细对比]
├── H2: Taste Comparison
├── H2: Nutrition Comparison
├── H2: Price Comparison
├── H2: Availability Comparison
└── H2: Which Should You Choose?

[投票/互动]（"Which do you prefer?" 投票组件）
[FAQ Section]
[相关对比文章]
```

### 3.5 页面模板 D — 食谱页（/recipes/ 系列）

```
[Hero Section]
├── H1 标题
├── 食谱评分（★★★★★）
├── 关键信息（Prep Time, Cook Time, Servings）
└── 成品图片（高质量实拍）

[Recipe Card]（Schema: Recipe 结构化数据）
├── 配料清单（Ingredients）
├── 步骤说明（Instructions，带编号）
├── 营养信息（Nutrition per serving）
└── 打印按钮

[正文内容]
├── 食谱故事/背景
├── 制作技巧（Tips）
├── 变体建议（Variations）
├── 步骤图片（Step-by-step photos）
└── 配套视频（嵌入 YouTube）

[用户评论/评分]
[相关食谱推荐]
```

### 3.6 页面模板 E — 数据页（/nutrition/ 系列）

```
[Hero Section]
├── H1 标题
├── 快速回答卡片（"Diet Cherry Coke has 0 calories..."）
└── 目录

[营养数据表]
├── 官方营养标签图片
├── 数据表格（每份含量）
└── 与其他饮料对比表

[详细解读]
├── H2: 各成分详解
├── H2: 与竞品对比
├── H2: 健康影响
└── H2: 常见问题

[FAQ Section]（Schema: FAQPage）
[来源引用]
```

---

## 四、技术 SEO 规范

### 4.1 网站性能要求

| 指标 | 目标值 |
|------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| PageSpeed Insights 分数 | Mobile ≥ 90, Desktop ≥ 95 |
| TTFB (Time to First Byte) | < 200ms |

### 4.2 结构化数据（Schema Markup）

| 页面类型 | Schema 类型 | 必填字段 |
|----------|------------|----------|
| 所有页面 | WebSite, Organization | name, url, logo |
| 首页 | WebPage, BreadcrumbList | name, description |
| 食谱页 | Recipe | name, image, prepTime, cookTime, ingredients, instructions, nutrition |
| 对比页 | FAQPage | question, acceptedAnswer |
| 评测页 | Review, Product | name, reviewRating, author |
| 营养页 | FAQPage, NutritionInformation | calories, servingSize |
| 购买指南 | Product, Offer | name, price, availability, url |

### 4.3 内链策略

```
首页 ←→ 所有一级页面（双向链接）

/is-it-back/ → /where-to-buy/ → /where-to-buy/walmart/ 等
/nutrition/ → /nutrition/calories/ → /nutrition/caffeine/ 等
/vs/ → /vs/coke-zero-cherry/ → /vs/cherry-coke/ 等
/recipes/ → /recipes/cocktails/ → /recipes/float/ 等

交叉链接：
/nutrition/calories/ → /vs/coke-zero-cherry/（"对比其他饮料"）
/where-to-buy/ → /price/（"查看价格对比"）
/is-it-back/ → /history/（"了解完整历史"）
/recipes/cocktails/ → /where-to-buy/（"先买到再做"）
```

### 4.4 Sitemap 与 Robots.txt

```xml
<!-- sitemap.xml 自动生成（Rank Math） -->
<!-- 确保以下页面在 sitemap 中 -->
优先级：
  首页: 1.0, changefreq: daily
  P0 页面: 0.9, changefreq: weekly
  P1 页面: 0.8, changefreq: weekly
  P2 页面: 0.7, changefreq: monthly
  P3 页面: 0.6, changefreq: monthly
  Blog: 0.5, changefreq: weekly
```

```
# robots.txt
User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /wp-includes/
Sitemap: https://dietcherrycoke.com/sitemap.xml
```

### 4.5 Canonical 与 Hreflang

```html
<!-- 每个页面设置 canonical -->
<link rel="canonical" href="https://dietcherrycoke.com/where-to-buy/" />

<!-- 后期多语言时添加 hreflang -->
<link rel="alternate" hreflang="en" href="https://dietcherrycoke.com/" />
<link rel="alternate" hreflang="en-gb" href="https://dietcherrycoke.com/uk/" />
```

### 4.6 Open Graph & Twitter Cards

```html
<!-- 每个页面必须包含 -->
<meta property="og:title" content="页面标题" />
<meta property="og:description" content="页面描述" />
<meta property="og:image" content="特色图片 URL（1200x630）" />
<meta property="og:url" content="页面 URL" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

---

## 五、内容生产规范

### 5.1 图片规范

| 类型 | 尺寸 | 格式 | 要求 |
|------|------|------|------|
| 特色图片 | 1200×630 | WebP (fallback JPG) | 每篇文章必须有 |
| 文内图片 | 800×600 | WebP | 原创实拍优先 |
| 产品图 | 800×800 | WebP (白底) | 正面、侧面、营养标签 |
| 食谱步骤图 | 800×600 | WebP | 每个关键步骤一张 |
| 信息图 | 800×2000 | WebP/PNG | 对比页、营养页使用 |

**图片命名规范：** `diet-cherry-coke-[描述]-[序号].webp`
**Alt 文本规范：** 描述性文字 + 关键词变体，如 "Diet Cherry Coke 12-pack cans on store shelf"

### 5.2 视频规范

| 类型 | 时长 | 平台 | 对应页面 |
|------|------|------|----------|
| 开箱评测 | 3-5 分钟 | YouTube + 嵌入网站 | /review/ |
| 盲测对比 | 2-3 分钟 | YouTube + TikTok | /vs/ 系列 |
| 食谱教程 | 1-3 分钟 | YouTube + Instagram Reels | /recipes/ 系列 |
| "找到了！"打卡 | 15-60 秒 | TikTok + Instagram | /where-to-buy/ |
| 历史回顾 | 5-8 分钟 | YouTube | /history/ |

### 5.3 E-E-A-T 建设

| 要素 | 实施方式 |
|------|----------|
| **Experience（经验）** | 所有评测基于真实购买和品尝，附实拍照片 |
| **Expertise（专业）** | 营养数据引用官方来源，食谱经过实际测试 |
| **Authoritativeness（权威）** | 作者页面、引用权威来源、被其他站点引用 |
| **Trustworthiness（可信）** | HTTPS、隐私政策、联系方式、来源标注 |

---

## 六、WordPress 插件清单

### 6.1 必装插件

| 插件 | 用途 | 优先级 |
|------|------|--------|
| Rank Math Pro | SEO 全面管理（Schema、Sitemap、On-Page） | 必装 |
| WP Rocket | 页面缓存、CSS/JS 优化 | 必装 |
| ShortPixel | 图片压缩、WebP 转换 | 必装 |
| WP Recipe Maker | 食谱页 Schema 标记 | 必装 |
| TablePress | 对比表格、营养数据表 | 必装 |
| Redirection | 301 重定向管理 | 必装 |

### 6.2 推荐插件

| 插件 | 用途 | 优先级 |
|------|------|--------|
| Jepack / Site Kit | Google Analytics & GSC 集成 | 推荐 |
| ThirstyAffiliates | 联盟链接管理（Amazon 等） | 推荐 |
| WPForms Lite | 联系表单 | 推荐 |
| Akismet | 垃圾评论过滤 | 推荐 |
| UpdraftPlus | 自动备份 | 推荐 |

---

## 七、开发里程碑

### Phase 1 — 基础建设（Week 1）

| 任务 | 交付物 | 验收标准 |
|------|--------|----------|
| 注册域名（需先确认可用性） | 域名所有权 | WHOIS 确认 |
| 购买主机 + 配置 SSL | 网站可访问 https://dietcherrycoke.com | SSL 证书有效 |
| 安装 WordPress + 主题 | 网站框架搭建完成 | 首页可正常加载 |
| 安装必装插件 | 插件全部激活 | Rank Math 配置完成 |
| 配置 GA4 + GSC | 数据追踪就绪 | 实时数据可见 |
| 发布 P0 页面（5 篇） | 5 个核心页面上线 | 所有页面 PageSpeed ≥ 90 |
| 提交 Sitemap 到 GSC | Google 开始抓取 | GSC 显示已提交 |
| 创建社交媒体账号 | 5 个平台账号就绪 | 账号名统一为 dietcherrycoke |

### Phase 2 — 内容扩展（Week 2-3）

| 任务 | 交付物 | 验收标准 |
|------|--------|----------|
| 发布 P1 页面（8 篇） | /where-to-buy/ + /nutrition/ 系列 | Schema 标记正确 |
| 发布 P2 页面（7 篇） | /recipes/ + /vs/ 系列 | 食谱页含 Recipe Schema |
| 拍摄产品照片 | 20+ 张原创图片 | WebP 格式、Alt 文本完整 |
| 制作第一批视频 | 3 个视频（评测、对比、食谱） | 上传 YouTube + 嵌入网站 |
| 开始外链建设 | 每天 20 条博客评论 | 用 site: 确认收录 |
| 提交目录站 | 50+ 个目录站提交 | 记录提交清单 |

### Phase 3 — 深度内容（Week 4）

| 任务 | 交付物 | 验收标准 |
|------|--------|----------|
| 发布 P3 页面（10 篇） | /history/ + /recipes/ 扩展 + /price/ | 全部页面上线 |
| 完善内链网络 | 所有页面互相链接 | 每页 3-5 个内链 |
| 社交媒体启动运营 | 每个平台发布 5+ 条内容 | 粉丝开始增长 |
| Product Hunt 发布 | PH 页面上线 | 获得初始曝光 |

### Phase 4 — 优化迭代（Month 2-3）

| 任务 | 交付物 | 验收标准 |
|------|--------|----------|
| GSC 数据分析 | 排名报告 | 识别 Top 20 但未进 Top 10 的页面 |
| 内容优化 | 优化 5-10 篇表现不佳的页面 | 排名提升 |
| 新增长尾页面 | 基于 GSC 发现的新关键词制作页面 | 10+ 新页面 |
| 持续外链 | 累计 200+ 外链 | 引用域名 50+ |
| 社交媒体持续运营 | 每天发布内容 | 各平台粉丝 500+ |

### Phase 5 — 变现优化（Month 4-6）

| 任务 | 交付物 | 验收标准 |
|------|--------|----------|
| 申请 Google Adsense | 广告代码部署 | 广告正常展示 |
| 接入 Amazon Affiliates | 购买链接替换为联盟链接 | 佣金开始产生 |
| A/B 测试广告位 | 优化广告收入 | RPM 提升 |
| 流量分析与扩展 | 月度报告 | 月流量达 2 万+ |

---

## 八、监控指标

### 8.1 SEO 指标（每周检查）

| 指标 | 工具 | 目标（3 个月） |
|------|------|---------------|
| 主关键词排名 | GSC / Ahrefs | Top 10 |
| 总关键词数 | GSC | 200+ |
| 自然搜索流量 | GA4 | 10,000+ /月 |
| 页面收录数 | GSC | 30+ 页面全部收录 |
| 平均 CTR | GSC | > 5% |
| 外链域名数 | Ahrefs | 50+ |

### 8.2 内容指标（每月检查）

| 指标 | 工具 | 目标 |
|------|------|------|
| 页面停留时间 | GA4 | > 2 分钟 |
| 跳出率 | GA4 | < 60% |
| 页面/会话 | GA4 | > 2 |
| 评论数 | WordPress | 每篇 5+ |

### 8.3 变现指标（每月检查）

| 指标 | 工具 | 目标（6 个月） |
|------|------|---------------|
| Adsense RPM | Adsense | > $5 |
| 联盟佣金 | Amazon | > $100/月 |
| 总月收入 | 汇总 | > $350/月 |

---

## 九、风险与应对

| 风险 | 概率 | 应对措施 |
|------|------|----------|
| 域名已被注册 | 高 | dietcherrycoke.com 已被可口可乐持有；使用 dietcherrycokeguide.com 等变体 |
| 搜索量下降 | 中 | 食谱/营养等常青内容不受事件影响 |
| Google 算法更新 | 低 | 坚持白帽 SEO，E-E-A-T 建设 |
| 品牌方投诉 | 极低 | 信息站属合理使用，不冒充官方 |
| 内容抄袭 | 中 | 所有内容原创，图片加水印 |

---

## 十、预算估算

| 项目 | 费用 | 频率 |
|------|------|------|
| 域名注册 | $12 | 年付 |
| 主机（Cloudways） | $14/月 | 月付 |
| Rank Math Pro | $59/年 | 年付 |
| WP Rocket | $59/年 | 年付 |
| ShortPixel | $4.99/月 | 月付 |
| 产品采购（拍照用） | $30 | 一次性 |
| **首年总计** | **约 $400** | |

---

*本文档基于 Ahrefs KD=0 数据、95 条 SERP 数据、Pancakes 案例方法论制定。*
*随着 GSC 数据积累，需求将持续迭代更新。*
