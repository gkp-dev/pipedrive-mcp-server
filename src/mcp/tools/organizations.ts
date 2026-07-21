import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { textResult } from "../../utils/mcp.js";
import { entityIdSchema, searchSchema } from "../tool-schemas.js";
import { READ_ONLY_TOOL_ANNOTATIONS } from "../tool-annotations.js";

export function registerOrganizationTools(server: McpServer, client: PipedriveClient): void {
  server.registerTool(
    "pipedrive_search_organizations",
    {
      description: "Search Pipedrive organizations by name, address, notes or custom fields.",
      inputSchema: searchSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async (input) => textResult(await client.searchOrganizations(input))
  );

  server.registerTool(
    "pipedrive_get_organization",
    {
      description: "Get one Pipedrive organization by ID.",
      inputSchema: entityIdSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async ({ id }) => textResult(await client.getOrganization(id))
  );
}

