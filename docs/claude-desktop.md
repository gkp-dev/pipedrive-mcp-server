# Connect Pipedrive to Claude

This guide covers Claude Desktop and Claude Code. Complete the installation and `.env` setup in the main [README](../README.md) first.

Keep `PIPEDRIVE_READ_ONLY=true` until read operations work correctly.

## Find the required paths

macOS or Linux:

```bash
which node
pwd
```

Windows PowerShell:

```powershell
(Get-Command node).Source
(Get-Location).Path
```

You need the absolute paths to the Node.js executable and this repository's `build/index.js` file.

## Claude Desktop

### 1. Open the configuration file

In Claude Desktop, open:

`Settings > Developer > Edit Config`

The documented locations are:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

On Linux, use the `Edit Config` button so Claude opens the correct file for the installed version.

### 2. Add the server

macOS or Linux example:

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "/absolute/path/to/node",
      "args": [
        "/absolute/path/to/pipedrive-mcp-server/build/index.js"
      ]
    }
  }
}
```

Windows example:

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "D:\\absolute\\path\\to\\pipedrive-mcp-server\\build\\index.js"
      ]
    }
  }
}
```

Replace the example paths with your own absolute paths. If the file already contains other servers, add `pipedrive` inside the existing `mcpServers` object instead of replacing the file.

The Pipedrive token stays in the repository's `.env` file. Do not copy it into `claude_desktop_config.json`.

### 3. Restart and test

Fully quit Claude Desktop, including any tray or menu bar process, then reopen it.

Ask:

```text
List the Pipedrive tools available to you.
```

Then try:

```text
Search Pipedrive deals containing "Acme".
```

## Claude Code

### 1. Add the server

User scope makes the server available in every Claude Code project while keeping the configuration private to your account.

macOS or Linux:

```bash
claude mcp add --scope user --transport stdio pipedrive -- /absolute/path/to/node /absolute/path/to/pipedrive-mcp-server/build/index.js
```

Windows PowerShell:

```powershell
claude mcp add --scope user --transport stdio pipedrive -- "C:\Program Files\nodejs\node.exe" "D:\absolute\path\to\pipedrive-mcp-server\build\index.js"
```

Everything after `--` is the command Claude Code uses to start the local stdio server.

### 2. Verify the connection

```bash
claude mcp list
claude mcp get pipedrive
```

Inside a Claude Code session, open:

```text
/mcp
```

The server should appear as connected with its Pipedrive tools.

### 3. Remove the server

```bash
claude mcp remove pipedrive --scope user
```

## Troubleshooting

### `PIPEDRIVE_API_TOKEN is required`

Confirm that `.env` exists beside `package.json`, not inside `build` or `src`.

### Claude Desktop does not show the server

- Validate the JSON syntax.
- Check that every path is absolute.
- On Windows, escape each backslash as `\\` inside JSON.
- Fully quit and reopen Claude Desktop.

Claude Desktop logs are normally available in:

- macOS: `~/Library/Logs/Claude`
- Windows: `%APPDATA%\Claude\logs`

Look for `mcp.log` and `mcp-server-pipedrive.log`.

### Claude Code reports a connection failure

Run `claude mcp get pipedrive` for the detailed error. Confirm that `npm run build` succeeds and that `build/index.js` exists.

### Write tools fail

This is expected while `PIPEDRIVE_READ_ONLY=true`. Read-only mode is the recommended starting point.

## Official references

- [Connect Claude Code to MCP servers](https://code.claude.com/docs/en/mcp-servers)
- [Claude Code MCP quickstart](https://code.claude.com/docs/en/mcp-quickstart)
- [Connect local MCP servers to Claude Desktop](https://modelcontextprotocol.io/docs/develop/connect-local-servers)
- [Build a one-click Claude Desktop bundle](https://claude.com/docs/connectors/building/mcpb)
