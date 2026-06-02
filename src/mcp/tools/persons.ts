import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppConfig } from "../../config.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { requireAtLeastOneField } from "../guards.js";
import { requireWritable, textResult } from "../../utils/mcp.js";
import { entityIdSchema, searchSchema, updatePersonSchema } from "../tool-schemas.js";

export function registerPersonTools(server: McpServer, client: PipedriveClient, config: AppConfig): void {
  server.registerTool(
    "pipedrive_search_persons",
    {
      description: "Search Pipedrive persons by name, email, phone or custom fields.",
      inputSchema: searchSchema
    },
    async (input) => textResult(await client.searchPersons(input))
  );

  server.registerTool(
    "pipedrive_get_person",
    {
      description: "Get one Pipedrive person by ID.",
      inputSchema: entityIdSchema
    },
    async ({ id }) => textResult(await client.getPerson(id))
  );

  server.registerTool(
    "pipedrive_update_person",
    {
      description: "Update allowed fields on one Pipedrive person. Destructive actions are not supported.",
      inputSchema: updatePersonSchema
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
