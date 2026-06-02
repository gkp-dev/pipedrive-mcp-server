import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { AppConfig } from "./config.js";
import { createPipedriveMcpServer } from "./mcp/server.js";

function sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
}

function isAuthorized(req: IncomingMessage, expectedToken: string): boolean {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return false;
  }

  const expected = Buffer.from(expectedToken);
  const received = Buffer.from(token);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return undefined;
  }

  return JSON.parse(rawBody);
}

export async function startHttpServer(config: AppConfig): Promise<void> {
  if (!config.mcpAuthToken) {
    throw new Error("MCP_AUTH_TOKEN is required when using HTTP transport.");
  }

  const mcpAuthToken = config.mcpAuthToken;
  const transports = new Map<string, StreamableHTTPServerTransport>();

  const httpServer = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(res, 200, {
        ok: true,
        service: "mcp-pipedrive",
        transport: "http",
        readOnly: config.readOnly
      });
      return;
    }

    if (req.method === "OPTIONS" && url.pathname === "/mcp") {
      res.writeHead(204, {
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Mcp-Session-Id, Last-Event-ID",
        "Access-Control-Max-Age": "86400"
      });
      res.end();
      return;
    }

    if (url.pathname !== "/mcp") {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    if (!isAuthorized(req, mcpAuthToken)) {
      sendJson(res, 401, { error: "Unauthorized" });
      return;
    }

    try {
      const sessionIdHeader = req.headers["mcp-session-id"];
      const sessionId = Array.isArray(sessionIdHeader) ? sessionIdHeader[0] : sessionIdHeader;
      let transport = sessionId ? transports.get(sessionId) : undefined;
      let parsedBody: unknown;

      if (req.method === "POST") {
        parsedBody = await readJsonBody(req);
      }

      if (!transport && req.method === "POST" && isInitializeRequest(parsedBody)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (newSessionId) => {
            if (transport) {
              transports.set(newSessionId, transport);
            }
          }
        });

        transport.onclose = () => {
          const closedSessionId = transport?.sessionId;
          if (closedSessionId) {
            transports.delete(closedSessionId);
          }
        };

        const mcpServer = createPipedriveMcpServer(config);
        await mcpServer.connect(transport);
      }

      if (!transport) {
        sendJson(res, 400, {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: no valid MCP session"
          },
          id: null
        });
        return;
      }

      await transport.handleRequest(req, res, parsedBody);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      if (!res.headersSent) {
        sendJson(res, 500, { error: "Internal server error" });
      }
    }
  });

  await new Promise<void>((resolve) => {
    httpServer.listen(config.httpPort, config.httpHost, resolve);
  });

  console.error(`MCP Pipedrive HTTP server listening on ${config.httpHost}:${config.httpPort}.`);
}
