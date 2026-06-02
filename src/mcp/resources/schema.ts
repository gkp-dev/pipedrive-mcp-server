import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PipedriveClient } from "../../pipedrive/client.js";
import { toJsonText } from "../../utils/json.js";

type Loader = () => Promise<unknown>;

export function registerSchemaResources(server: McpServer, client: PipedriveClient): void {
  registerJsonResource(server, "pipedrive_pipelines", "pipedrive://pipelines", () => client.listPipelines());
  registerJsonResource(server, "pipedrive_stages", "pipedrive://stages", () => client.listStages());
  registerJsonResource(server, "pipedrive_users", "pipedrive://users", () => client.listUsers());
  registerJsonResource(server, "pipedrive_deal_fields", "pipedrive://deal-fields", () => client.listDealFields());
  registerJsonResource(server, "pipedrive_person_fields", "pipedrive://person-fields", () => client.listPersonFields());
  registerJsonResource(server, "pipedrive_organization_fields", "pipedrive://organization-fields", () =>
    client.listOrganizationFields()
  );
}

function registerJsonResource(server: McpServer, name: string, uri: string, loader: Loader): void {
  server.registerResource(
    name,
    uri,
    {
      title: name,
      mimeType: "application/json"
    },
    async () => ({
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: toJsonText(await loader())
        }
      ]
    })
  );
}

