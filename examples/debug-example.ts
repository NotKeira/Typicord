/**
 * Example: Typicord Debug System
 *
 * This example demonstrates how the debug system works with environment variables.
 * Set TYPI_DEBUG=true in your .env file to see debug output from Typicord.
 */

import { Client, GatewayIntentBits } from "typicord";
import { config } from "dotenv";

// Load environment variables
config();

// The debug system automatically checks process.env.TYPI_DEBUG
// No need to import anything else!

const client = new Client(
  process.env.DISCORD_TOKEN || "your_token_here",
  GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages
);

client.on("READY", data => {
  console.log(`🤖 Bot ready as ${data.user.username}`);
  console.log("Set TYPI_DEBUG=true in your .env to see debug output!");
});

client.on("MESSAGE_CREATE", message => {
  if (message.content === "!ping") {
    // This will show debug output if TYPI_DEBUG=true
    client.rest.post(`/channels/${message.channelId}/messages`, {
      content: "Pong! Check console for debug output if TYPI_DEBUG=true",
    });
  }
});

// Connect to Discord - debug output will show if TYPI_DEBUG=true
try {
  client.connect();
} catch (error) {
  console.error("Failed to connect:", error);
}
