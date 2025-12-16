# n8n-nodes-perfex-crm

Community node package for n8n that integrates with Perfex CRM REST API.

## Features
- Action node supporting major Perfex API resources and CRUD operations
- Trigger node with polling for new records
- Secure credential type with Bearer and Authtoken modes
- Robust error handling and logging via n8n helpers
- TypeScript with JSDoc and tests (unit + integration)

## Installation
- In an n8n instance, install the published package from npm or add the files under `~/.n8n/custom`.

## Requirements
- Your Perfex CRM installation must have the official REST API module installed and activated.
- Module: `https://codecanyon.net/item/rest-api-for-perfex-crm/25278359`

## Authentication
- Generate an API token in Perfex CRM.
- Use either:
  - `Authorization: Bearer <token>` (preferred)
  - `authtoken` header or query parameter (legacy)
- Provide `Base URL` like `https://yourdomain.com`.

## Action Node
- Resource: `items`, `customers`, `invoices`, `leads`, `projects`, `tasks`, `subscriptions`, `estimates`, `contracts`, `expenses`, `payments`, `taxes`, `payment_modes`, `staff`, `milestones`, `custom_fields`.
- Operation: `list`, `get`, `search`, `create`, `update`, `delete`.
- Search:
  - `items`: `/api/items/search/:key`
  - Other resources: `?search=<key>`

## Trigger Node
- Polls the selected resource at a configurable interval.
- Emits new records with ID greater than `Start From ID`.

## Usage Example
- List Leads:
  - Resource: `leads`
  - Operation: `list`
  - Base URL: `https://yourdomain.com`
  - Credentials: Perfex CRM API (Bearer Token)

## Testing
- Unit tests: `npm test`
- Integration tests:
  - Set env:
    - `PERFEX_BASE_URL`
    - `PERFEX_TOKEN`
    - `PERFEX_AUTH_TYPE` (`bearer` | `authtokenHeader` | `authtokenQuery`)
  - Run `npm test` (integration tests auto-skip if env missing).

## Security
- Never hardcode tokens.
- Use HTTPS URLs.
- Prefer Bearer tokens with scoped permissions.

## Compatibility
- Built against latest n8n versions and TypeScript 5.

## License
- MIT
