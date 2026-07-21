# Connect Pipedrive to Codex

Codex CLI, the Codex app, and the Codex IDE extension share the same MCP configuration.

Complete the installation and `.env` setup in the main [README](../README.md) before continuing.

## Find the required paths

From the repository folder, find Node.js and the project path.

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

You need two absolute paths:

1. The Node.js executable.
2. `build/index.js` inside this repository.

## Option 1: Add the server with the Codex CLI

This is the shortest method.

macOS or Linux:

```bash
codex mcp add pipedrive -- /absolute/path/to/node /absolute/path/to/pipedrive-mcp-server/build/index.js
```

Windows PowerShell:

```powershell
codex mcp add pipedrive -- "C:\Program Files\nodejs\node.exe" "D:\absolute\path\to\pipedrive-mcp-server\build\index.js"
```

Replace both example paths with the values found on your machine.

## Option 2: Configure `config.toml`

Open Codex settings and select `Open config.toml`, or edit `~/.codex/config.toml` directly.

macOS or Linux:

```toml
[mcp_servers.pipedrive]
command = "/absolute/path/to/node"
args = ["build/index.js"]
cwd = "/absolute/path/to/pipedrive-mcp-server"
startup_timeout_sec = 30
```

Windows uses the same configuration. Forward slashes make TOML paths easier to read:

```toml
[mcp_servers.pipedrive]
command = "C:/Program Files/nodejs/node.exe"
args = ["build/index.js"]
cwd = "D:/absolute/path/to/pipedrive-mcp-server"
startup_timeout_sec = 30
```

Do not add your Pipedrive token to `config.toml`. The server reads it from the `.env` file in its installation folder.

## Verify the server

List configured servers:

```bash
codex mcp list
```

Start or restart Codex, then open the MCP panel:

```text
/mcp
```

Confirm that `pipedrive` is connected and exposes tools. Test it with:

```text
Use Pipedrive to search for deals containing "Acme".
```

## Remove the server

```bash
codex mcp remove pipedrive
```

## Troubleshooting

### Codex cannot find `node`

Use the absolute Node.js path as `command`. GUI applications do not always inherit the same `PATH` as your terminal.

### The server appears but does not connect

Run these commands from the repository:

```bash
npm run build
npm test
```

Then confirm that the configured path points to `build/index.js`, not `src/index.ts`.

### Configuration changes do not appear

Restart Codex after editing `config.toml`. The CLI, app, and IDE extension use the same Codex configuration layers.

## Official reference

See the official [Codex MCP configuration guide](https://learn.chatgpt.com/docs/extend/mcp) and [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).
