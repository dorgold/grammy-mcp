#!/usr/bin/env node

import { Bot } from "grammy";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

function getCliArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index !== -1 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return undefined;
}

function getToken(): string {
  const token = getCliArg("token") ?? process.env.TELEGRAM_BOT_TOKEN;
  if (token) return token;

  console.error(
    "Error: Telegram bot token is required.\n" +
      "Provide it via --token <token> or TELEGRAM_BOT_TOKEN environment variable."
  );
  process.exit(1);
}

function getChatId(): string | undefined {
  return getCliArg("chat-id") ?? process.env.TELEGRAM_CHAT_ID;
}

async function main(): Promise<void> {
  const token = getToken();
  const defaultChatId = getChatId();
  const bot = new Bot(token);

  // Validate the token by calling getMe
  await bot.init();

  const server = createServer(bot.api, { defaultChatId });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
