# Security

This MCP server gives an AI client access to Pipedrive data. When write mode is enabled, it can also create activities, add notes, and update selected fields.

## Current safeguards

- `.env` and its variants are ignored by Git.
- `PIPEDRIVE_READ_ONLY=true` blocks all write tools.
- Invalid boolean values are rejected instead of enabling writes.
- Delete operations are not exposed.
- Tool inputs are validated with Zod.
- The Pipedrive token is sent in the `x-api-token` header and never added to request URLs.
- The API destination is fixed to the official Pipedrive endpoint.
- MCP tool annotations distinguish reads, updates, and non-idempotent creations for compatible clients.
- API requests use a configurable timeout.
- The local stdio transport does not open a network port.
- Runtime logs use stderr because stdout is reserved for the MCP protocol.

## Token handling

- Use your own Pipedrive token and keep it in the local `.env` file.
- Do not place the token in screenshots, support messages, shell history, or committed MCP configuration files.
- Restrict access to `.env` and local client configuration files to your operating-system user.
- Revoke and regenerate the token immediately if it is exposed.
- Remember that regenerating a Pipedrive token breaks every integration using the previous value.

The server resolves `.env` relative to its installation directory. Claude and Codex therefore do not need the token in their own configuration.

## Write access

Start with:

```env
PIPEDRIVE_READ_ONLY=true
```

Enable writes only after read-only requests work. Test the first write operation on a dedicated Pipedrive record.

Tool annotations help compatible clients present appropriate confirmations, but they are metadata rather than an authorization boundary. `PIPEDRIVE_READ_ONLY` remains the server-side control.

The API token inherits the permissions and accessible data of its Pipedrive user. Read-only mode limits the MCP tools, but it does not reduce the underlying Pipedrive token permissions.

## Before publishing changes

Run:

```bash
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
git status --short
```

Also verify that `.env`, `node_modules`, `build`, credentials, private URLs, and customer-specific fields are not tracked.

The current MCP SDK pulls `@hono/node-server` 1.x, which has a moderate path-traversal advisory in its static-file middleware. This server does not use that middleware. Do not force version 2 into the SDK dependency tree; update when the SDK publishes a compatible fix.

## Distribution boundary

A local single-user integration can use a personal Pipedrive API token. A public service for multiple users or Pipedrive companies should implement Pipedrive OAuth with per-user authorization and scoped access.
