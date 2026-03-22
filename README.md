# grammy-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes [grammY](https://grammy.dev) Telegram Bot API functionality as tools for LLM clients like Claude, Cursor, and others.

## Quick Start

```bash
npx grammy-mcp --token YOUR_BOT_TOKEN
```

Or set the environment variable:

```bash
export TELEGRAM_BOT_TOKEN=your_bot_token
npx grammy-mcp
```

## Configuration

### Token

Provide your Telegram bot token (from [@BotFather](https://t.me/BotFather)) via:

1. **CLI argument**: `--token <token>` (takes precedence)
2. **Environment variable**: `TELEGRAM_BOT_TOKEN`

### Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "telegram": {
      "command": "npx",
      "args": ["grammy-mcp"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "your_bot_token"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "telegram": {
      "command": "npx",
      "args": ["grammy-mcp"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "your_bot_token"
      }
    }
  }
}
```

## Available Tools

### `send_message`

Send a text message to a Telegram chat.

| Parameter    | Type   | Required | Description                                      |
| ------------ | ------ | -------- | ------------------------------------------------ |
| `chat_id`    | string | Yes      | Target chat ID or @username                      |
| `text`       | string | Yes      | Message text to send                             |
| `parse_mode` | string | No       | Formatting: `HTML`, `Markdown`, or `MarkdownV2`  |

## Extending with New Tools

The architecture makes it easy to add more grammY API methods:

1. Create a new file in `src/tools/` (e.g., `send-photo.ts`):

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Api } from "grammy";
import { z } from "zod";

export function registerSendPhoto(server: McpServer, api: Api): void {
  server.tool(
    "send_photo",
    "Send a photo to a Telegram chat",
    {
      chat_id: z.string().describe("Target chat ID or @username"),
      photo: z.string().describe("Photo URL or file_id"),
      caption: z.string().optional().describe("Photo caption"),
    },
    async ({ chat_id, photo, caption }) => {
      const result = await api.sendPhoto(chat_id, photo, { caption });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
```

2. Register it in `src/tools/index.ts`:

```typescript
import { registerSendPhoto } from "./send-photo.js";

export function registerTools(server: McpServer, api: Api): void {
  registerSendMessage(server, api);
  registerSendPhoto(server, api); // ← add here
}
```

3. Rebuild: `npm run build`

## License

MIT
