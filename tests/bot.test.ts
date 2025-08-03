// Skip integration tests in CI environment
if (process.env.SKIP_INTEGRATION_TESTS === "true") {
  console.log("⏭️  Skipping integration tests (SKIP_INTEGRATION_TESTS=true)");
  process.exit(0);
}

import { GatewayClient } from "../src/gateway/GatewayClient";
import { GatewayIntentBits, Client } from "../src/client/Client";

const token =
  "your-token";
const intents =
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.GuildMessageReactions |
  GatewayIntentBits.GuildMessageTyping |
  GatewayIntentBits.DirectMessages |
  GatewayIntentBits.DirectMessageReactions |
  GatewayIntentBits.DirectMessageTyping |
  GatewayIntentBits.MessageContent;

const client = new Client(token, intents);

// Set up graceful shutdown
let isShuttingDown = false;

function gracefulShutdown(code: number = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("🔄 Shutting down gracefully...");

  // Give the client time to disconnect properly
  if (client.gateway) {
    client.gateway.disconnect();
  }

  setTimeout(() => {
    console.log("✅ Bot test completed");
    process.exit(code);
  }, 1000);
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", error => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown(1);
});

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown(0));
process.on("SIGINT", () => gracefulShutdown(0));

client.on("MESSAGE_CREATE", async data => {
  try {
    // Convert the event data to a Message object if needed
    const msg = data as any; // Type assertion for testing
    if (msg.author?.bot) return;
    if (!msg.content?.startsWith("!")) return;

    const [command] = msg.content.slice(1).split(/\s+/);

    if (command === "ping") {
      const sent = Date.now();
      const reply = await msg.reply("Pinging...");
      const apiLatency = Date.now() - sent;
      const wsLatency = client.gateway.getPing?.() ?? -1;

      await reply.edit(`🏓 Pong!
API Latency: ${apiLatency}ms
WebSocket Latency: ${wsLatency}ms`);
    }
  } catch (error) {
    console.error("❌ Error in MESSAGE_CREATE handler:", error);
  }
});

client.on("GUILD_CREATE", data => {
  console.log(`Joined guild: ${data.name} (${data.id})`);
});

client.on("READY", data => {
  console.log(`Logged in as ${data.user.username}#${data.user.discriminator}`);
  console.log(`User ID: ${data.user.id}`);
  console.log(`Guilds: ${data.guilds.length}`);
  console.log("✅ Bot is ready and connected!");

  // For automated testing, disconnect after a short time
  if (process.env.CI === "true") {
    console.log("🤖 CI environment detected, disconnecting after 5 seconds...");
    setTimeout(() => {
      gracefulShutdown(0);
    }, 5000);
  }
});

// Add error event handler
client.on("error" as any, (error: Error) => {
  console.error("❌ Client error:", error);
  gracefulShutdown(1);
});

// Add disconnect handler
client.on("disconnect" as any, (data: any) => {
  console.log(`🔌 Disconnected:`, data);
  if (!isShuttingDown) {
    gracefulShutdown(0);
  }
});

// Connect with error handling
try {
  console.log("🔌 Connecting to Discord...");
  client.connect();
} catch (error) {
  console.error("❌ Failed to connect:", error);
  gracefulShutdown(1);
}
