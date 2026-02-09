# Content Management

Markdown/MDX content collections, schemas, content types, and content production workflow.

## Requirements

### Requirement: Astro Content Collections
The site SHALL use Astro Content Collections to manage all content as Markdown/MDX files stored in the Git repository.

#### Scenario: Content directory structure
- **WHEN** the project is set up
- **THEN** content is organized under `src/content/` with typed collections: `articles`, `recipes`, `reviews`, `comparisons`, `retailers`

#### Scenario: Content schema validation
- **WHEN** a Markdown file is added to a collection
- **THEN** Astro validates the frontmatter against the collection's Zod schema
- **AND** build fails if required fields are missing or invalid

### Requirement: Article Content Schema
The site SHALL define a schema for article-type content with SEO and display metadata.

#### Scenario: Valid article frontmatter
- **WHEN** an article Markdown file includes `title`, `description`, `publishDate`, `author`, `category`, `tags`, `image`, and `priority` (P0-P3)
- **THEN** the content is accepted and rendered correctly

#### Scenario: Missing required field
- **WHEN** an article is missing the `title` or `description` field
- **THEN** the build fails with a clear validation error

### Requirement: Recipe Content Schema
The site SHALL define a schema for recipe content with structured cooking data.

#### Scenario: Valid recipe frontmatter
- **WHEN** a recipe Markdown file includes `title`, `description`, `prepTime`, `cookTime`, `servings`, `ingredients`, `image`, and `category`
- **THEN** the content is accepted and can generate Recipe JSON-LD schema

### Requirement: Comparison Content Schema
The site SHALL define a schema for product comparison pages.

#### Scenario: Valid comparison frontmatter
- **WHEN** a comparison Markdown file includes `title`, `description`, `productA`, `productB`, `image`, and `verdict`
- **THEN** the content is accepted and renders a structured comparison layout

### Requirement: Retailer Content Schema
The site SHALL define a schema for retailer/where-to-buy pages.

#### Scenario: Valid retailer frontmatter
- **WHEN** a retailer Markdown file includes `title`, `description`, `retailerName`, `retailerUrl`, `availability`, `priceRange`, and `image`
- **THEN** the content is accepted and renders a retailer-specific buying guide

### Requirement: Content Priority System
The site SHALL support a priority field (P0-P3) to control content production order.

#### Scenario: Priority filtering
- **WHEN** content is queried with a priority filter
- **THEN** only content matching the specified priority level is returned
- **AND** P0 content is produced first, followed by P1, P2, P3

### Requirement: Multi-language Readiness
The site SHALL structure content to support future multi-language expansion.

#### Scenario: Default English content
- **WHEN** content is created without a `locale` field
- **THEN** it defaults to `en` (English)

#### Scenario: Future locale support
- **WHEN** a `locale` field is added to content frontmatter
- **THEN** the content system can filter and route by locale
- **AND** URL structure supports `/[locale]/[slug]` pattern
