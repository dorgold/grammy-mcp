#!/usr/bin/env node

import { Bot } from "grammy";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

function getToken(): string {
  // CLI arg takes precedence: --token <value>
  const tokenArgIndex = process.argv.indexOf("--token");
  if (tokenArgIndex !== -1 && process.argv[tokenArgIndex + 1]) {
    return process.argv[tokenArgIndex + 1];
  }

  if (process.env.TELEGRAM_BOT_TOKEN) {
    return process.env.TELEGRAM_BOT_TOKEN;
  }

  console.error(
    "Error: Telegram bot token is required.\n" +
      "Provide it via --token <token> or TELEGRAM_BOT_TOKEN environment variable."
  );
  process.exit(1);
}

async function main(): Promise<void> {
  const token = getToken();
  const bot = new Bot(token);

  // Validate the token by calling getMe
  await bot.init();

  const server = createServer(bot.api);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
