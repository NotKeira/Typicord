/**
 * Basic Bot Example
 *
 * This example demonstrates the most basic usage of Typicord:
 * - Creating a client
 * - Connecting to Discord
 * - Handling the READY event
 * - Responding to messages
 */

import { Client, GatewayIntentBits, Events } from "../src";

// Create a new client instance
const client = new Client(
  "YOUR_BOT_TOKEN",
  GatewayIntentBits.Guilds |
    GatewayIntentBits.GuildMessages |
    GatewayIntentBits.MessageContent
);

// Handle the ready event
client.on("READY", (ready: Events.Ready) => {
  console.log(`🚀 Bot is ready! Logged in as ${ready.user.username}`);
  console.log(`📊 Connected to ${ready.guilds.length} guilds`);
});

// Handle incoming messages
client.on("MESSAGE_CREATE", (message: Events.MessageCreate) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Simple ping command
  if (message.content === "!ping") {
    client.sendMessage(message.channelId, "Pong! 🏓");
  }

  // Echo command
  if (message.content.startsWith("!echo ")) {
    const text = message.content.slice(6);
    client.sendMessage(message.channelId, `📢 ${text}`);
  }
});

// Connect to Discord
client.connect();

// Handle process termination gracefully
process.on("SIGINT", () => {
  console.log("👋 Shutting down...");
  client.destroy();
  process.exit(0);
});
