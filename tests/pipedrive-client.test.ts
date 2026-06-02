import { beforeEach, describe, expect, it, vi } from "vitest";
import { PipedriveClient } from "../src/pipedrive/client.js";
import { AppConfig } from "../src/config.js";

const config: AppConfig = {
  apiToken: "token-for-tests",
  apiBaseUrl: "https://api.example.test/v1",
  defaultLimit: 25,
  requestTimeoutMs: 1000,
  readOnly: false
};

describe("PipedriveClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("adds the API token and query params to GET requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new PipedriveClient(config);
    await client.searchDeals({ term: "Acme", limit: 10 });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe("/v1/deals/search");
    expect(url.searchParams.get("api_token")).toBe("token-for-tests");
    expect(url.searchParams.get("term")).toBe("Acme");
    expect(url.searchParams.get("limit")).toBe("10");
  });

  it("flattens custom fields when updating deals", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { id: 42 } })
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new PipedriveClient(config);
    await client.updateDeal(42, {
      title: "Updated",
      custom_fields: {
        abc123: "custom value"
      }
    });

    const init = fetchMock.mock.calls[0][1];
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      title: "Updated",
      abc123: "custom value"
    });
  });
});
