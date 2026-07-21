import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppConfig } from "../../config.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { requireAtLeastOneField } from "../guards.js";
import { requireWritable, textResult } from "../../utils/mcp.js";
import { entityIdSchema, searchSchema, updateDealSchema } from "../tool-schemas.js";
import { READ_ONLY_TOOL_ANNOTATIONS, UPDATE_TOOL_ANNOTATIONS } from "../tool-annotations.js";

export function registerDealTools(server: McpServer, client: PipedriveClient, config: AppConfig): void {
  server.registerTool(
    "pipedrive_search_deals",
    {
      description: "Search Pipedrive deals by text.",
      inputSchema: searchSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async (input) => textResult(await client.searchDeals(input))
  );

  server.registerTool(
    "pipedrive_get_deal",
    {
      description: "Get one Pipedrive deal by ID.",
      inputSchema: entityIdSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async ({ id }) => textResult(await client.getDeal(id))
  );

  server.registerTool(
    "pipedrive_update_deal",
    {
      description: "Update allowed fields on one Pipedrive deal. Deletion is not supported.",
      inputSchema: updateDealSchema,
      annotations: UPDATE_TOOL_ANNOTATIONS
    },
    async ({ id, ...payload }) => {
      requireWritable(config.readOnly);
      requireAtLeastOneField(
        payload,
        [
          "title",
          "value",
          "currency",
          "status",
          "stage_id",
          "user_id",
          "person_id",
          "org_id",
          "expected_close_date",
          "custom_fields"
        ],
        "At least one deal field must be provided."
      );

      return textResult(await client.updateDeal(id, payload));
    }
  );
}
