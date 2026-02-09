# Analytics

Cloudflare Web Analytics and Google Analytics 4 integration for traffic and conversion tracking.

## Requirements

### Requirement: Cloudflare Web Analytics
The site SHALL integrate Cloudflare Web Analytics for privacy-friendly traffic monitoring.

#### Scenario: Analytics beacon
- **WHEN** any page loads
- **THEN** the Cloudflare Web Analytics beacon script is included
- **AND** the beacon token is loaded from environment configuration
- **AND** no cookies are set by the analytics script

#### Scenario: Page view tracking
- **WHEN** a user navigates to a page
- **THEN** a page view event is sent to Cloudflare Analytics
- **AND** the event includes page URL, referrer, and country

### Requirement: Google Analytics 4
The site SHALL integrate GA4 for detailed user behavior and conversion tracking.

#### Scenario: GA4 script loading
- **WHEN** any page loads
- **THEN** the GA4 gtag.js script loads asynchronously
- **AND** the measurement ID is loaded from environment configuration

#### Scenario: Page view event
- **WHEN** a user visits a page
- **THEN** a `page_view` event is sent to GA4 with page title, path, and referrer

#### Scenario: Custom events
- **WHEN** a user clicks an affiliate link
- **THEN** a custom `affiliate_click` event is sent to GA4 with product name and retailer
- **WHEN** a user subscribes to the newsletter
- **THEN** a custom `newsletter_signup` event is sent to GA4

### Requirement: Analytics Configuration
The site SHALL load analytics IDs from environment variables, not hardcoded values.

#### Scenario: Environment-based configuration
- **WHEN** the site builds or renders
- **THEN** analytics IDs are read from `PUBLIC_CF_ANALYTICS_TOKEN` and `PUBLIC_GA4_MEASUREMENT_ID`
- **AND** if either variable is missing, the corresponding analytics script is not loaded

### Requirement: Performance Impact
Analytics scripts SHALL NOT degrade Core Web Vitals scores.

#### Scenario: Script loading strategy
- **WHEN** analytics scripts load
- **THEN** they use `async` or `defer` attributes
- **AND** they do not block the critical rendering path
- **AND** total analytics script size is under 30KB combined

### Requirement: Google Search Console
The site SHALL support Google Search Console verification and monitoring.

#### Scenario: Site verification
- **WHEN** the homepage renders
- **THEN** it includes the GSC verification meta tag if `PUBLIC_GSC_VERIFICATION` env var is set

#### Scenario: Sitemap submission
- **WHEN** the site is deployed
- **THEN** the sitemap URL (`https://dietcherrycoke.net/sitemap.xml`) is available for GSC submission
