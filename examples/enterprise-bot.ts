import { Client } from "@/client/Client";
import { ShardStatus } from "@/gateway/Shard";

/**
 * Enterprise-grade Discord bot example
 * Demonstrates advanced features like sharding and rate limiting
 */

const GUILD_INTENTS = 1 | 512 | 32768; // GUILDS | GUILD_MESSAGES | MESSAGE_CONTENT

// Create a client with enterprise-grade features
const client = new Client(process.env.DISCORD_TOKEN!, GUILD_INTENTS, {
  // Configure sharding for large bots
  shardCount: 2, // Number of shards to spawn
  totalShards: 2, // Total shards across all processes
});

// Basic connection events
client.on("READY", data => {
  console.log(
    `✅ Logged in as ${data.user.username}#${data.user.discriminator}`
  );
  console.log(`📊 Connected with ${client.shards.options.shardCount} shards`);
});

// Monitor shard events
client.shards.on("shardConnect", shardId => {
  console.log(`🔗 Shard ${shardId} connected`);
});

client.shards.on("shardDisconnect", (shardId, code, reason) => {
  console.log(`❌ Shard ${shardId} disconnected (${code}): ${reason}`);
});

client.shards.on("shardError", (shardId, error) => {
  console.error(`💥 Shard ${shardId} error:`, error);
});

// Advanced message handling with sharding awareness
client.on("MESSAGE_CREATE", data => {
  const message = data.message;
  const shard = client.shards.getShardForGuild(message.guild_id || "");

  if (message.content === "!ping") {
    const shardPing = shard?.ping || 0;
    client.rest.post(`/channels/${message.channel_id}/messages`, {
      content: `🏓 Pong! Shard ${shard?.id || "DM"} latency: ${shardPing}ms`,
    });
  }

  if (message.content === "!shards") {
    const shardCount = client.shards.options.shardCount;
    const activeShards = Array.from(client.shards.shards.values()).filter(
      shard => shard.status === ShardStatus.CONNECTED
    ).length;

    client.rest.post(`/channels/${message.channel_id}/messages`, {
      content: `� **Shard Status**: ${activeShards}/${shardCount} shards active`,
    });
  }
});

// Guild tracking with shard awareness
client.on("GUILD_CREATE", data => {
  const guild = data.guild;
  const shard = client.shards.getShardForGuild(guild.id);
  console.log(
    `🏰 Joined guild: ${guild.name} (ID: ${guild.id}) on shard ${shard?.id || "unknown"}`
  );
});

client.on("GUILD_DELETE", data => {
  const guild = data;
  const shard = client.shards.getShardForGuild(guild.id);
  console.log(`👋 Left guild: ${guild.id} on shard ${shard?.id || "unknown"}`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  client.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  client.destroy();
  process.exit(0);
});

// Enhanced error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", error => {
  console.error("💥 Uncaught Exception:", error);
  client.destroy();
  process.exit(1);
});

// Start the enterprise bot
console.log(
  "🚀 Starting enterprise Discord bot with advanced sharding and rate limiting..."
);
client.connect();
