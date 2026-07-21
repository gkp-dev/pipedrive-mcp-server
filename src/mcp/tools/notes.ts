import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { requireAtLeastOneField } from "../guards.js";
import { requireWritable, textResult } from "../../utils/mcp.js";
import { AppConfig } from "../../config.js";
import { addNoteSchema, listNotesSchema } from "../tool-schemas.js";
import { CREATE_TOOL_ANNOTATIONS, READ_ONLY_TOOL_ANNOTATIONS } from "../tool-annotations.js";

export function registerNoteTools(server: McpServer, client: PipedriveClient, config: AppConfig): void {
  server.registerTool(
    "pipedrive_list_notes",
    {
      description: "List Pipedrive notes attached to a deal, person, organization or lead.",
      inputSchema: listNotesSchema,
      annotations: READ_ONLY_TOOL_ANNOTATIONS
    },
    async (input) => textResult(await client.listNotes(input))
  );

  server.registerTool(
    "pipedrive_add_note",
    {
      description: "Add a note to a Pipedrive deal, person, organization or lead.",
      inputSchema: addNoteSchema,
      annotations: CREATE_TOOL_ANNOTATIONS
    },
    async (input) => {
      requireWritable(config.readOnly);
      requireAtLeastOneField(
        input,
        ["deal_id", "person_id", "org_id", "lead_id"],
        "A note must be attached to a deal, person, organization or lead."
      );

      return textResult(await client.addNote(input));
    }
  );
}

