import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { requireWritable, textResult } from "../../utils/mcp.js";
import { AppConfig } from "../../config.js";
import { createActivitySchema, listActivitiesSchema } from "../tool-schemas.js";
import { CREATE_TOOL_ANNOTATIONS, READ_ONLY_TOOL_ANNOTATIONS } from "../tool-annotations.js";

export function registerActivityTools(server: McpServer, client: PipedriveClient, config: AppConfig): void {
  server.registerTool(
    "pipedrive_list_activities",
    {
      description: "List Pipedrive activities filtered by deal, person, organization, user, type, status or date.",
      inputSchema: listActivitiesSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async (input) => textResult(await client.listActivities(input))
  );

  server.registerTool(
    "pipedrive_create_activity",
    {
      description: "Create a Pipedrive activity and optionally attach it to a deal, person or organization.",
      inputSchema: createActivitySchema,
      annotations: CREATE_TOOL_ANNOTATIONS
    },
    async (input) => {
      requireWritable(config.readOnly);
      return textResult(await client.createActivity(input));
    }
  );
}

