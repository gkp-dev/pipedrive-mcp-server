export interface AppConfig {
  apiToken: string;
  apiBaseUrl: string;
  defaultLimit: number;
  requestTimeoutMs: number;
  readOnly: boolean;
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

  const normalized = value.toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  throw new Error(`${name} must be a boolean.`);
}

export const PIPEDRIVE_API_BASE_URL = "https://api.pipedrive.com/v1";

export function loadConfig(): AppConfig {
  const apiToken = process.env.PIPEDRIVE_API_TOKEN;

  if (!apiToken) {
    throw new Error("PIPEDRIVE_API_TOKEN is required.");
  }

  return {
    apiToken,
    apiBaseUrl: PIPEDRIVE_API_BASE_URL,
    defaultLimit: readNumber("PIPEDRIVE_DEFAULT_LIMIT", 25),
    requestTimeoutMs: readNumber("PIPEDRIVE_REQUEST_TIMEOUT_MS", 30000),
    readOnly: readBoolean("PIPEDRIVE_READ_ONLY", true)
  };
}
