import { describe, expect, it } from "vitest";
import { requireAtLeastOneField } from "../src/mcp/guards.js";
import { requireWritable } from "../src/utils/mcp.js";

describe("MCP guards", () => {
  it("rejects empty update payloads", () => {
    expect(() => requireAtLeastOneField({}, ["title"], "Missing field.")).toThrow("Missing field.");
  });

  it("accepts payloads with one populated field", () => {
    expect(() => requireAtLeastOneField({ title: "New title" }, ["title"], "Missing field.")).not.toThrow();
  });

  it("rejects writes when read-only mode is enabled", () => {
    expect(() => requireWritable(true)).toThrow("read-only mode");
  });
});

