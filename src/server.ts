import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Api } from "grammy";
import { registerTools } from "./tools/index.js";

export function createServer(api: Api): McpServer {
  const server = new McpServer({
    name: "grammy-mcp",
    version: "0.1.0",
  });

  registerTools(server, api);

  return server;
}
