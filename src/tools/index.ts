import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Api } from "grammy";
import { registerSendMessage } from "./send-message.js";

/**
 * Register all tools on the MCP server.
 * To add a new tool: create a file in tools/, then import and call it here.
 */
export function registerTools(server: McpServer, api: Api): void {
  registerSendMessage(server, api);
}
