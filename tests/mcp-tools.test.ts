import { afterEach, describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { AppConfig, PIPEDRIVE_API_BASE_URL } from "../src/config.js";
import { createPipedriveMcpServer } from "../src/mcp/server.js";
import {
  CREATE_TOOL_ANNOTATIONS,
  READ_ONLY_TOOL_ANNOTATIONS,
  UPDATE_TOOL_ANNOTATIONS
} from "../src/mcp/tool-annotations.js";

const config: AppConfig = {
  apiToken: "token-for-tests",
  apiBaseUrl: PIPEDRIVE_API_BASE_URL,
  defaultLimit: 25,
  requestTimeoutMs: 1000,
  readOnly: true
};

describe("MCP tool annotations", () => {
  const closeCallbacks: Array<() => Promise<void>> = [];

  afterEach(async () => {
    await Promise.all(closeCallbacks.splice(0).map((close) => close()));
  });

  it("describes read, update and create behavior to MCP clients", async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const server = createPipedriveMcpServer(config);
    const client = new Client({ name: "mcp-pipedrive-test", version: "1.0.0" });

    closeCallbacks.push(() => client.close(), () => server.close());
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const { tools } = await client.listTools();
    const annotationsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool.annotations]));

    for (const name of [
      "pipedrive_search_deals",
      "pipedrive_get_deal",
      "pipedrive_search_persons",
      "pipedrive_get_person",
      "pipedrive_search_organizations",
      "pipedrive_get_organization",
      "pipedrive_list_activities",
      "pipedrive_list_notes"
    ]) {
      expect(annotationsByName[name]).toEqual(READ_ONLY_TOOL_ANNOTATIONS);
    }

    for (const name of ["pipedrive_update_deal", "pipedrive_update_person"]) {
      expect(annotationsByName[name]).toEqual(UPDATE_TOOL_ANNOTATIONS);
    }

    for (const name of ["pipedrive_create_activity", "pipedrive_add_note"]) {
      expect(annotationsByName[name]).toEqual(CREATE_TOOL_ANNOTATIONS);
    }

    expect(tools).toHaveLength(12);
  });
});
