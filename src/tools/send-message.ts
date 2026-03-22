import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Api } from "grammy";
import { z } from "zod";

export function registerSendMessage(server: McpServer, api: Api): void {
  server.tool(
    "send_message",
    "Send a text message to a Telegram chat",
    {
      chat_id: z.string().describe("The target chat ID or @username"),
      text: z.string().describe("The message text to send"),
      parse_mode: z
        .enum(["HTML", "Markdown", "MarkdownV2"])
        .optional()
        .describe("Optional formatting mode for the message"),
    },
    async ({ chat_id, text, parse_mode }) => {
      try {
        const result = await api.sendMessage(chat_id, text, {
          parse_mode,
        });

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  ok: true,
                  message_id: result.message_id,
                  chat_id: result.chat.id,
                  date: result.date,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text" as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
