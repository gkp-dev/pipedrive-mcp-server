import { beforeEach, describe, expect, it, vi } from "vitest";
import { PipedriveClient } from "../src/pipedrive/client.js";
import { AppConfig, PIPEDRIVE_API_BASE_URL } from "../src/config.js";

const config: AppConfig = {
  apiToken: "token-for-tests",
  apiBaseUrl: PIPEDRIVE_API_BASE_URL,
  defaultLimit: 25,
  requestTimeoutMs: 1000,
  readOnly: false
};

describe("PipedriveClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the API token in a header and keeps it out of the URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new PipedriveClient(config);
    await client.searchDeals({ term: "Acme", limit: 10 });

    const [requestUrl, init] = fetchMock.mock.calls[0];
    const url = new URL(requestUrl);
    expect(url.pathname).toBe("/v1/deals/search");
    expect(url.searchParams.has("api_token")).toBe(false);
    expect(url.searchParams.get("term")).toBe("Acme");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(init.headers["x-api-token"]).toBe("token-for-tests");
  });

  it("uses the configured limit when a search omits it", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new PipedriveClient(config);
    await client.searchDeals({ term: "Acme" });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("limit")).toBe("25");
  });

  it("uses the configured limit for paginated list requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new PipedriveClient(config);
    await client.listActivities({ done: false });

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.pathname).toBe("/v1/activities");
    expect(url.searchParams.get("limit")).toBe("25");
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
