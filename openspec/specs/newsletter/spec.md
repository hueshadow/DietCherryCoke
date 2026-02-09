# Newsletter

Email subscription system using Cloudflare Workers and Resend API.

## Requirements

### Requirement: Subscription Form
The site SHALL display a newsletter subscription form in the footer and as a standalone component.

#### Scenario: Form rendering
- **WHEN** any page loads
- **THEN** the footer contains an email input field and a subscribe button
- **AND** the form includes a brief value proposition (e.g., "Get Diet Cherry Coke updates")

#### Scenario: Valid email submission
- **WHEN** a user enters a valid email and clicks subscribe
- **THEN** the form shows a success message ("Thanks for subscribing!")
- **AND** the email is sent to the subscription API

#### Scenario: Invalid email submission
- **WHEN** a user enters an invalid email format
- **THEN** the form shows a client-side validation error
- **AND** no API request is made

#### Scenario: Duplicate email
- **WHEN** a user submits an email that is already subscribed
- **THEN** the form shows a friendly message ("You're already subscribed!")

### Requirement: Subscription API
The site SHALL provide a subscription endpoint via Cloudflare Workers.

#### Scenario: New subscriber
- **WHEN** a POST request is made to `/api/subscribe` with a valid email
- **THEN** the email is stored in Cloudflare KV or D1
- **AND** a confirmation email is sent via Resend API
- **AND** the response returns 200 with a success message

#### Scenario: Rate limiting
- **WHEN** more than 5 subscription requests come from the same IP within 1 minute
- **THEN** the API returns 429 Too Many Requests

### Requirement: Confirmation Email
The site SHALL send a confirmation email to new subscribers via Resend.

#### Scenario: Confirmation email content
- **WHEN** a new email is successfully stored
- **THEN** Resend sends a welcome email with the site branding
- **AND** the email includes a brief welcome message and an unsubscribe link

### Requirement: Subscriber Data Storage
The site SHALL store subscriber emails in Cloudflare KV or D1.

#### Scenario: Data persistence
- **WHEN** a new subscriber is added
- **THEN** the email, subscription date, and status are stored
- **AND** the data persists across Worker invocations

#### Scenario: Unsubscribe
- **WHEN** a subscriber clicks the unsubscribe link
- **THEN** their status is updated to "unsubscribed"
- **AND** they no longer receive emails
