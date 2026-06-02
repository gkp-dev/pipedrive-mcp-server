export interface AppConfig {
  apiToken: string;
  apiBaseUrl: string;
  defaultLimit: number;
  requestTimeoutMs: number;
  readOnly: boolean;
  transport: "stdio" | "http";
  httpPort: number;
  httpHost: string;
  mcpAuthToken?: string;
}

function readNumber(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }

  return parsed;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function readTransport(): "stdio" | "http" {
  const value = process.env.MCP_TRANSPORT ?? "stdio";

  if (value !== "stdio" && value !== "http") {
    throw new Error("MCP_TRANSPORT must be either 'stdio' or 'http'.");
  }

  return value;
}

export function loadConfig(): AppConfig {
  const apiToken = process.env.PIPEDRIVE_API_TOKEN;
  const transport = readTransport();
  const mcpAuthToken = process.env.MCP_AUTH_TOKEN;

  if (!apiToken) {
    throw new Error("PIPEDRIVE_API_TOKEN is required.");
  }

  if (transport === "http" && !mcpAuthToken) {
    throw new Error("MCP_AUTH_TOKEN is required when MCP_TRANSPORT=http.");
  }

  return {
    apiToken,
    apiBaseUrl: process.env.PIPEDRIVE_API_BASE_URL ?? "https://api.pipedrive.com/v1",
    defaultLimit: readNumber("PIPEDRIVE_DEFAULT_LIMIT", 25),
    requestTimeoutMs: readNumber("PIPEDRIVE_REQUEST_TIMEOUT_MS", 30000),
    readOnly: readBoolean("PIPEDRIVE_READ_ONLY", true),
    transport,
    httpPort: readNumber("PORT", 3000),
    httpHost: process.env.HOST ?? "0.0.0.0",
    mcpAuthToken
  };
}
