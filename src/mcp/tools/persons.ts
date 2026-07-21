import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppConfig } from "../../config.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { requireAtLeastOneField } from "../guards.js";
import { requireWritable, textResult } from "../../utils/mcp.js";
import { entityIdSchema, searchSchema, updatePersonSchema } from "../tool-schemas.js";
import { READ_ONLY_TOOL_ANNOTATIONS, UPDATE_TOOL_ANNOTATIONS } from "../tool-annotations.js";

export function registerPersonTools(server: McpServer, client: PipedriveClient, config: AppConfig): void {
  server.registerTool(
    "pipedrive_search_persons",
    {
      description: "Search Pipedrive persons by name, email, phone or custom fields.",
      inputSchema: searchSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async (input) => textResult(await client.searchPersons(input))
  );

  server.registerTool(
    "pipedrive_get_person",
    {
      description: "Get one Pipedrive person by ID.",
      inputSchema: entityIdSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async ({ id }) => textResult(await client.getPerson(id))
  );

  server.registerTool(
    "pipedrive_update_person",
    {
      description: "Update allowed fields on one Pipedrive person. Deletion is not supported.",
      inputSchema: updatePersonSchema,
      annotations: UPDATE_TOOL_ANNOTATIONS
    },
    async ({ id, ...payload }) => {
      requireWritable(config.readOnly);
      requireAtLeastOneField(
        payload,
        ["name", "owner_id", "org_id", "email", "phone", "custom_fields"],
        "At least one person field must be provided."
      );

      return textResult(await client.updatePerson(id, payload));
    }
  );
}
