import { Client, GatewayIntentBits } from "../src/index";

/**
 * Demo showing off the new reconnection logic with exponential backoff
 * Pretty neat stuff if I do say so myself!
 */

console.log("🚀 Starting Typicord reconnection example...");

// Set up a client - using a dummy token since this is just a demo
const client = new Client(
  "DUMMY_TOKEN_FOR_DEMO",
  GatewayIntentBits.MessageContent
);

// When the bot's ready, show some info
client.on("READY", () => {
  console.log("✅ Bot is ready!");
  console.log(
    `🤖 Logged in as: ${client.user?.name}#${client.user?.discriminator}`
  );
  console.log(`🔌 Gateway latency: ${client.gateway.getWebSocketLatency()}ms`);
});

// Listen for messages and auto-reply to mentions
client.on("MESSAGE_CREATE", message => {
  console.log(`💬 Message from ${message.author.username}: ${message.content}`);

  // Reply if we're mentioned
  if (message.content.includes(`<@${client.user?.id}>`)) {
    message.reply("Hello! I received your mention!");
  }
});

// Start connecting
console.log("📡 Attempting to connect to Discord Gateway...");
console.log(
  "🔄 The client will automatically handle reconnections with exponential backoff"
);
console.log(
  "📝 Session resumption is enabled to maintain state across reconnections"
);

// This will fail with the dummy token, but shows how the reconnection system works
try {
  client.connect();
} catch (error) {
  console.log("❌ Connection failed (expected with dummy token)");
  console.error("Error details:", error);
  console.log(
    "🔄 In a real scenario, the ReconnectionManager would handle retries automatically"
  );
}

// Show off what the reconnection manager can do
console.log("\n📊 Reconnection Manager Features:");
console.log("  • Exponential backoff: 1s, 2s, 4s, 8s, 16s, ...");
console.log("  • Maximum delay cap: 5 minutes");
console.log("  • Jitter to prevent thundering herd");
console.log("  • Session resumption to maintain state");
console.log("  • Automatic retry limit (10 attempts by default)");
console.log("  • Proper handling of non-recoverable errors");

console.log("\n🔧 Close codes that prevent reconnection:");
console.log("  • 4004: Authentication failed");
console.log("  • 4010: Invalid shard");
console.log("  • 4011: Sharding required");
console.log("  • 4012: Invalid API version");
console.log("  • 4013: Invalid intent(s)");
console.log("  • 4014: Disallowed intent(s)");

// Clean shutdown after the demo
setTimeout(() => {
  console.log("\n🛑 Disconnecting gracefully...");
  client.disconnect();
  console.log("✅ Demo completed!");
  process.exit(0);
}, 3000);
