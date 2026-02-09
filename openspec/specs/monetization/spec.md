# Monetization

Google Adsense advertising and Amazon Associates affiliate link integration.

## Requirements

### Requirement: Adsense Ad Slots
The site SHALL provide configurable Google Adsense ad placement slots on content pages.

#### Scenario: Article page ad placement
- **WHEN** an article page renders with ads enabled
- **THEN** ad slots are placed at: top of content (below title), mid-content (after 3rd paragraph), and sidebar
- **AND** ads load asynchronously without blocking page render

#### Scenario: Ads disabled via frontmatter
- **WHEN** a content page has `showAds: false` in frontmatter
- **THEN** no ad slots are rendered on that page

#### Scenario: Mobile ad layout
- **WHEN** the viewport is mobile
- **THEN** sidebar ads are hidden
- **AND** in-content ads use responsive ad units

### Requirement: Adsense Script Loading
The site SHALL load the Adsense script efficiently without impacting Core Web Vitals.

#### Scenario: Lazy loading
- **WHEN** a page with ads loads
- **THEN** the Adsense script loads after the main content is rendered
- **AND** ad containers have explicit dimensions to prevent CLS

### Requirement: Amazon Affiliate Links
The site SHALL provide a reusable component for Amazon Associates affiliate links.

#### Scenario: Affiliate link rendering
- **WHEN** an Amazon affiliate link component is used in content
- **THEN** it renders a styled product card or inline link with the affiliate tag appended
- **AND** the link includes `rel="nofollow sponsored"` attributes

#### Scenario: Product card display
- **WHEN** an affiliate product card renders
- **THEN** it displays product name, image, brief description, and a "Buy on Amazon" CTA button
- **AND** the CTA uses the accent color (Coca-Cola red)

### Requirement: Affiliate Disclosure
The site SHALL display an affiliate disclosure on pages containing affiliate links.

#### Scenario: Disclosure rendering
- **WHEN** a page contains one or more affiliate links
- **THEN** a disclosure notice is displayed near the top of the content
- **AND** the disclosure text complies with FTC guidelines

### Requirement: Ad-Free Pages
The site SHALL allow certain pages to be ad-free.

#### Scenario: Legal pages
- **WHEN** the privacy policy, terms of service, or about page renders
- **THEN** no ads or affiliate links are displayed
