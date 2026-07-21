import { afterEach, describe, expect, it, vi } from "vitest";
import { loadConfig, PIPEDRIVE_API_BASE_URL } from "../src/config.js";

describe("loadConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps read-only mode enabled by default", () => {
    vi.stubEnv("PIPEDRIVE_API_TOKEN", "token-for-tests");
    vi.stubEnv("PIPEDRIVE_READ_ONLY", "");

    expect(loadConfig().readOnly).toBe(true);
  });

  it("rejects an invalid read-only value", () => {
    vi.stubEnv("PIPEDRIVE_API_TOKEN", "token-for-tests");
    vi.stubEnv("PIPEDRIVE_READ_ONLY", "tru");

    expect(() => loadConfig()).toThrow("PIPEDRIVE_READ_ONLY must be a boolean.");
  });

  it("loads the configured default limit", () => {
    vi.stubEnv("PIPEDRIVE_API_TOKEN", "token-for-tests");
    vi.stubEnv("PIPEDRIVE_DEFAULT_LIMIT", "40");

    expect(loadConfig().defaultLimit).toBe(40);
  });

  it("always uses the official Pipedrive API endpoint", () => {
    vi.stubEnv("PIPEDRIVE_API_TOKEN", "token-for-tests");
    vi.stubEnv("PIPEDRIVE_API_BASE_URL", "https://attacker.example/v1");

    expect(loadConfig().apiBaseUrl).toBe(PIPEDRIVE_API_BASE_URL);
  });
});
