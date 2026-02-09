# Site Search

Client-side search UI with Cloudflare Workers backend for full-text search across site content.

## Requirements

### Requirement: Search Index Generation
The site SHALL generate a search index at build time from all published content.

#### Scenario: Build-time indexing
- **WHEN** the site builds
- **THEN** a JSON search index is generated containing title, description, URL, category, and content excerpt for every published page
- **AND** the index is optimized for size (stripped of HTML, truncated content)

#### Scenario: New content indexed
- **WHEN** a new Markdown file is added and the site rebuilds
- **THEN** the new content appears in the search index

### Requirement: Search API
The site SHALL provide a search API endpoint via Cloudflare Workers.

#### Scenario: Keyword search
- **WHEN** a GET request is made to `/api/search?q=nutrition`
- **THEN** the API returns a JSON array of matching results sorted by relevance
- **AND** each result includes `title`, `url`, `excerpt`, and `category`

#### Scenario: Empty query
- **WHEN** a search request has an empty or missing `q` parameter
- **THEN** the API returns an empty results array with a 200 status

#### Scenario: No results
- **WHEN** a search query matches no content
- **THEN** the API returns an empty results array with a 200 status

### Requirement: Search UI Component
The site SHALL provide an interactive search component as a React Island.

#### Scenario: Search bar interaction
- **WHEN** a user clicks the search icon in the header
- **THEN** a search overlay or dropdown appears with a text input
- **AND** the input is auto-focused

#### Scenario: Live search results
- **WHEN** a user types 3 or more characters in the search input
- **THEN** search results appear below the input after a 300ms debounce
- **AND** results display title, category badge, and content excerpt

#### Scenario: Result navigation
- **WHEN** a user clicks a search result
- **THEN** they are navigated to the corresponding page
- **AND** the search overlay closes

#### Scenario: Keyword highlighting
- **WHEN** search results are displayed
- **THEN** the matching keywords are highlighted in the excerpt text
