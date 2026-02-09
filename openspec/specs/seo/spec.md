# SEO

Search engine optimization infrastructure including meta tags, structured data, sitemaps, and search console integration.

## Requirements

### Requirement: Page Meta Tags
The site SHALL generate complete meta tags for every page including title, description, and canonical URL.

#### Scenario: Article page meta
- **WHEN** an article page renders
- **THEN** the `<title>` tag contains the article title and site name
- **AND** `<meta name="description">` contains the article description (max 160 chars)
- **AND** `<link rel="canonical">` points to the page's absolute URL on dietcherrycoke.net

#### Scenario: Missing description fallback
- **WHEN** a page has no explicit description
- **THEN** the system generates a description from the first 160 characters of content

### Requirement: Open Graph Tags
The site SHALL include Open Graph meta tags on all pages for social media sharing.

#### Scenario: Article shared on social media
- **WHEN** an article URL is shared on Facebook or LinkedIn
- **THEN** the preview displays `og:title`, `og:description`, `og:image`, `og:url`, and `og:type`
- **AND** `og:type` is "article" for content pages and "website" for the homepage

### Requirement: Twitter Cards
The site SHALL include Twitter Card meta tags on all pages.

#### Scenario: Article shared on Twitter/X
- **WHEN** an article URL is shared on Twitter/X
- **THEN** the preview displays a summary_large_image card with title, description, and image

### Requirement: JSON-LD Structured Data
The site SHALL embed JSON-LD structured data appropriate to each page type.

#### Scenario: Article page schema
- **WHEN** an article page renders
- **THEN** it includes `Article` JSON-LD with headline, author, datePublished, dateModified, image, and publisher

#### Scenario: Recipe page schema
- **WHEN** a recipe page renders
- **THEN** it includes `Recipe` JSON-LD with name, image, prepTime, cookTime, recipeIngredient, and recipeInstructions

#### Scenario: FAQ page schema
- **WHEN** the FAQ page renders
- **THEN** it includes `FAQPage` JSON-LD with Question and Answer pairs

#### Scenario: Breadcrumb schema
- **WHEN** any page with breadcrumbs renders
- **THEN** it includes `BreadcrumbList` JSON-LD matching the visible breadcrumb trail

#### Scenario: Product comparison schema
- **WHEN** a comparison page renders
- **THEN** it includes `Product` JSON-LD for each compared product with name, description, and brand

### Requirement: Sitemap Generation
The site SHALL automatically generate a sitemap.xml during build.

#### Scenario: Sitemap content
- **WHEN** the site builds
- **THEN** a `sitemap.xml` is generated at the root containing all public page URLs
- **AND** each entry includes `<loc>`, `<lastmod>`, and `<changefreq>`
- **AND** the sitemap URL is referenced in `robots.txt`

#### Scenario: New page added
- **WHEN** a new Markdown content file is added
- **THEN** the next build automatically includes the new page in the sitemap

### Requirement: Robots.txt
The site SHALL serve a robots.txt file that allows search engine crawling.

#### Scenario: Robots.txt content
- **WHEN** a crawler requests `/robots.txt`
- **THEN** it returns `User-agent: *` with `Allow: /`
- **AND** includes `Sitemap: https://dietcherrycoke.net/sitemap.xml`

### Requirement: Google Search Console Integration
The site SHALL support Google Search Console verification.

#### Scenario: Verification meta tag
- **WHEN** the homepage renders
- **THEN** it includes the Google Search Console verification meta tag
- **AND** the tag value is configurable via environment variable
