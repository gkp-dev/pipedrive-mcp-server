import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppConfig } from "../config.js";
import { PipedriveClient } from "../pipedrive/client.js";
import { registerActivityTools } from "./tools/activities.js";
import { registerDealTools } from "./tools/deals.js";
import { registerNoteTools } from "./tools/notes.js";
import { registerOrganizationTools } from "./tools/organizations.js";
import { registerPersonTools } from "./tools/persons.js";
import { registerSchemaResources } from "./resources/schema.js";

export function createPipedriveMcpServer(config: AppConfig): McpServer {
  const server = new McpServer({
    name: "mcp-pipedrive",
    version: "0.1.0"
  });
  const client = new PipedriveClient(config);

  registerDealTools(server, client, config);
  registerPersonTools(server, client, config);
  registerOrganizationTools(server, client);
  registerActivityTools(server, client, config);
  registerNoteTools(server, client, config);
  registerSchemaResources(server, client);

  return server;
}
