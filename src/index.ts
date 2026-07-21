#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { createPipedriveMcpServer } from "./mcp/server.js";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(serverDirectory, "..", ".env"), quiet: true });

async function main(): Promise<void> {
  const config = loadConfig();
  const server = createPipedriveMcpServer(config);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("MCP Pipedrive server started.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
