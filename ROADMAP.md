# Roadmap

## Current position

Phase 1: Local Pipedrive MCP server. Complete.

Phase 2: Clear cross-platform distribution. In progress.

The server supports local stdio connections for Claude Desktop, Claude Code, and Codex on Windows, macOS, and Linux. Installation still requires cloning the repository and building it locally.

## Completed

- Typed Pipedrive read tools for deals, people, organizations, activities, and notes.
- Guarded write tools for selected updates, activities, and notes.
- Read-only mode enabled by default.
- Local stdio transport.
- Input validation with Zod.
- Automated type checking, tests, and build.
- Cross-platform source installation guide.

## Next steps

- Publish an npm package with a stable command name.
- Build and test a signed `.mcpb` bundle for one-click Claude Desktop installation.
- Test installation from a clean Windows machine, macOS machine, and Linux machine.
- Add release automation and checksums for distributed artifacts.
- Add focused tests for configuration loading.
- Improve Pipedrive API error messages and operational logs.

## Later

- Implement Pipedrive OAuth for multi-user distribution.
- Add per-user scopes and authorization policies.
- Add rate limiting, audit logs, and tracing for hosted deployments.
- Publish deployment examples without private URLs or credentials.

## Known limits

- The current authentication model uses one personal Pipedrive API token.
- Source installation requires Node.js 20 or newer and Git.
- No one-click Claude Desktop bundle or npm release is published yet.
- `npm audit` currently reports a moderate advisory in `@hono/node-server`, pulled by the MCP SDK. This project does not use the affected static-file middleware. Track the SDK update instead of forcing an incompatible major dependency.
