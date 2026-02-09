# Project Context

## Purpose
Diet Cherry Coke SEO 内容网站 — 利用 "diet cherry coke" 关键词（KD=0）的 SEO 机会，构建垂直信息站点。
- 域名: dietcherrycoke.net
- 目标: Google 搜索排名前 10（3 个月内），月访问 2-5 万（6 个月内）
- 变现: Google Adsense + Amazon 联盟
- 语言: 英文为主，预留多语言扩展

## Tech Stack
- **Framework**: Astro (静态优先，Islands 架构)
- **CSS**: Tailwind CSS
- **Content**: Markdown/MDX 内容集合 (Astro Content Collections)
- **Deployment**: Cloudflare Pages + Workers
- **Email**: Resend
- **Analytics**: Cloudflare Web Analytics + Google Analytics 4
- **Search**: Cloudflare Workers 驱动的站内搜索

## Project Conventions

### Code Style
- TypeScript 优先
- Astro 组件使用 `.astro` 文件
- 交互组件使用 React Islands
- Tailwind CSS 原子化样式，避免自定义 CSS
- 文件命名: kebab-case

### Architecture Patterns
- Astro Content Collections 管理 Markdown 内容
- 静态生成 (SSG) 为主，Workers 处理动态功能
- 组件化设计：Layout → Page → Section → Component
- SEO 优先：每个页面都有完整的 meta、JSON-LD、Open Graph

### Git Workflow
- main 分支为生产分支
- feature/* 分支开发新功能
- Conventional Commits 规范

## Domain Context
- Diet Cherry Coke 是可口可乐旗下产品，2026 年 2 月在美国重新上市
- 目标用户: 美国消费者，搜索 Diet Cherry Coke 相关信息
- 内容类型: 产品信息、购买指南、营养成分、食谱、对比评测
- 竞争环境: 关键词难度极低 (KD=0)，竞争对手少

## Important Constraints
- 性能优先: Core Web Vitals 必须达到绿色评分
- 零 JavaScript 默认: 只在需要交互的地方加载 JS (Islands)
- 隐私合规: 使用 Cloudflare Analytics 减少 cookie 依赖
- 成本控制: 尽量使用免费/低成本服务

## External Dependencies
- **Cloudflare**: Pages (托管) + Workers (动态功能) + Web Analytics
- **Google**: Analytics 4 + Search Console + Adsense
- **Amazon**: Associates 联盟计划
- **Resend**: 邮件订阅服务
