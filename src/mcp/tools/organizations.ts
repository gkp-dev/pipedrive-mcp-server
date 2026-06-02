import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { textResult } from "../../utils/mcp.js";
import { entityIdSchema, searchSchema } from "../tool-schemas.js";

export function registerOrganizationTools(server: McpServer, client: PipedriveClient): void {
  server.registerTool(
    "pipedrive_search_organizations",
    {
      description: "Search Pipedrive organizations by name, address, notes or custom fields.",
      inputSchema: searchSchema
    },
    async (input) => textResult(await client.searchOrganizations(input))
  );

  server.registerTool(
    "pipedrive_get_organization",
    {
      description: "Get one Pipedrive organization by ID.",
      inputSchema: entityIdSchema
    },
    async ({ id }) => textResult(await client.getOrganization(id))
  );
}

