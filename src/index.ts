#!/usr/bin/env node
import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { startHttpServer } from "./http-server.js";
import { createPipedriveMcpServer } from "./mcp/server.js";

async function main(): Promise<void> {
  const config = loadConfig();

  if (config.transport === "http") {
    await startHttpServer(config);
    return;
  }

  const server = createPipedriveMcpServer(config);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("MCP Pipedrive server started.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
