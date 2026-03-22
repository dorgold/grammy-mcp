import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Api } from "grammy";
import { z } from "zod";
import type { ServerOptions } from "../server.js";

export function registerSendMessage(
  server: McpServer,
  api: Api,
  options: ServerOptions
): void {
  const chatIdDesc = options.defaultChatId
    ? `Target chat ID or @username (defaults to ${options.defaultChatId})`
    : "The target chat ID or @username";

  server.tool(
    "send_message",
    "Send a text message to a Telegram chat",
    {
      chat_id: z.string().optional().describe(chatIdDesc),
      text: z.string().describe("The message text to send"),
      parse_mode: z
        .enum(["HTML", "Markdown", "MarkdownV2"])
        .optional()
        .describe("Optional formatting mode for the message"),
    },
    async ({ chat_id, text, parse_mode }) => {
      const resolvedChatId = chat_id ?? options.defaultChatId;
      if (!resolvedChatId) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: chat_id is required. Provide it as a parameter or set a default via --chat-id or TELEGRAM_CHAT_ID.",
            },
          ],
          isError: true,
        };
      }

      try {
        const result = await api.sendMessage(resolvedChatId, text, {
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
