# Site Foundation

Core site structure, layouts, navigation, theming, and responsive design.

## Requirements

### Requirement: Dark Theme Design System
The site SHALL implement a dark-themed design system with Coca-Cola red as the accent color.

#### Scenario: Default page rendering
- **WHEN** a user visits any page
- **THEN** the page renders with dark background (`#0a0a0a` to `#1a1a1a`)
- **AND** primary text is high-contrast white (`#f5f5f5`)
- **AND** accent color is Coca-Cola red (`#e61e2b`)

#### Scenario: Interactive element hover
- **WHEN** a user hovers over a link or button
- **THEN** the element transitions to the hover accent color (`#ff2d3a`)
- **AND** the transition duration is 200-300ms

### Requirement: Responsive Grid Layout
The site SHALL use a 12-column grid system that adapts to device width.

#### Scenario: Mobile viewport
- **WHEN** viewport width is below 640px
- **THEN** the layout uses a 4-column grid
- **AND** navigation collapses to a hamburger menu

#### Scenario: Tablet viewport
- **WHEN** viewport width is between 768px and 1023px
- **THEN** the layout uses an 8-column grid

#### Scenario: Desktop viewport
- **WHEN** viewport width is 1024px or above
- **THEN** the layout uses a 12-column grid
- **AND** content max-width is constrained to 1200px

### Requirement: Global Header
The site SHALL display a persistent header on all pages with navigation and search access.

#### Scenario: Header rendering
- **WHEN** any page loads
- **THEN** the header displays the site logo, primary navigation links, and a search icon
- **AND** the header is sticky on scroll with a backdrop blur effect

#### Scenario: Mobile header
- **WHEN** viewport is mobile
- **THEN** the navigation links collapse into a hamburger menu
- **AND** tapping the hamburger opens a full-screen navigation overlay

### Requirement: Global Footer
The site SHALL display a footer on all pages with site links, legal info, and newsletter signup.

#### Scenario: Footer rendering
- **WHEN** any page loads
- **THEN** the footer displays site navigation links, social media icons, a newsletter subscription form, and a disclaimer/copyright notice

### Requirement: Breadcrumb Navigation
The site SHALL display breadcrumb navigation on all pages except the homepage.

#### Scenario: Article page breadcrumb
- **WHEN** a user visits `/where-to-buy/walmart`
- **THEN** the breadcrumb displays: Home > Where to Buy > Walmart
- **AND** each breadcrumb segment is a clickable link except the current page

#### Scenario: Homepage breadcrumb
- **WHEN** a user visits `/`
- **THEN** no breadcrumb is displayed

### Requirement: Page Layouts
The site SHALL provide multiple layout templates for different page types.

#### Scenario: Landing layout
- **WHEN** the homepage or a hub page renders
- **THEN** it uses the LandingLayout with full-width hero section and grid-based content sections

#### Scenario: Article layout
- **WHEN** an article or content page renders
- **THEN** it uses the ArticleLayout with a content area and an optional sidebar
- **AND** the sidebar contains a table of contents, related articles, and ad slots

### Requirement: Performance Baseline
The site SHALL achieve green Core Web Vitals scores on all pages.

#### Scenario: Lighthouse audit
- **WHEN** a page is audited with Google Lighthouse
- **THEN** Performance score is 90+
- **AND** LCP is under 2.5s, FID under 100ms, CLS under 0.1

#### Scenario: Zero JavaScript default
- **WHEN** a page without interactive components loads
- **THEN** zero client-side JavaScript is shipped
- **AND** only pages with Islands (search, newsletter form) load JS

### Requirement: Astro Islands Architecture
The site SHALL use Astro Islands for interactive components, loading JavaScript only where needed.

#### Scenario: Static page
- **WHEN** a page has no interactive elements
- **THEN** the page is rendered as pure static HTML with zero JS bundle

#### Scenario: Interactive component
- **WHEN** a page includes a search bar or newsletter form
- **THEN** only that component's JavaScript is hydrated on the client
- **AND** the rest of the page remains static HTML
