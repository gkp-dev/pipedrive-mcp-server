import { toJsonText } from "./json.js";

export function textResult(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: typeof value === "string" ? value : toJsonText(value)
      }
    ]
  };
}

export function requireWritable(readOnly: boolean) {
  if (readOnly) {
    throw new Error("This server is running in read-only mode. Write tools are disabled.");
  }
}

