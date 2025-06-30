import { Client, GatewayIntentBits } from "../src/client/Client";
import { Message } from "../src/structures/Message";

/**
 * Memory usage benchmark - helps identify potential memory leaks
 * and optimize memory usage for long-running bots
 */

function formatBytes(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    rss: usage.rss,
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
    external: usage.external,
  };
}

async function runMemoryBenchmark() {
  console.log("🧠 Running Memory Usage Benchmarks...\n");

  const initialMemory = getMemoryUsage();
  console.log("Initial memory usage:");
  console.log(`  RSS: ${formatBytes(initialMemory.rss)}`);
  console.log(`  Heap Used: ${formatBytes(initialMemory.heapUsed)}`);
  console.log(`  Heap Total: ${formatBytes(initialMemory.heapTotal)}`);
  console.log(`  External: ${formatBytes(initialMemory.external)}\n`);

  // Test 1: Client creation memory usage
  console.log("📈 Test 1: Client Creation");
  const clients: Client[] = [];
  for (let i = 0; i < 10; i++) {
    clients.push(new Client("fake-token", GatewayIntentBits.GuildMessages));
  }

  const afterClientsMemory = getMemoryUsage();
  console.log(`Memory after creating 10 clients:`);
  console.log(
    `  Heap Used: ${formatBytes(afterClientsMemory.heapUsed)} (+${formatBytes(afterClientsMemory.heapUsed - initialMemory.heapUsed)})`
  );

  // Test 2: Message processing memory usage
  console.log("\n📈 Test 2: Message Processing");
  const sampleMessageData = {
    id: "1234567890123456789",
    channel_id: "9876543210987654321",
    content: "Test message for memory benchmark",
    timestamp: "2025-06-30T12:00:00.000000+00:00",
    edited_timestamp: null,
    tts: false,
    mention_everyone: false,
    mentions: [],
    mention_roles: [],
    attachments: [],
    embeds: [],
    reactions: [],
    nonce: null,
    pinned: false,
    webhook_id: null,
    type: 0,
    activity: null,
    application: null,
    message_reference: null,
    flags: 0,
    referenced_message: null,
    interaction: null,
    thread: null,
    components: [],
    sticker_items: [],
    author: {
      id: "1111111111111111111",
      username: "TestUser",
      avatar: "avatar_hash_here",
      discriminator: "1234",
      public_flags: 0,
      bot: false,
    },
  };

  const messages: Message[] = [];
  for (let i = 0; i < 1000; i++) {
    messages.push(
      new Message(clients[0], {
        ...sampleMessageData,
        id: `${1234567890123456789 + i}`,
        content: `Message ${i + 1}`,
      })
    );
  }

  const afterMessagesMemory = getMemoryUsage();
  console.log(`Memory after processing 1000 messages:`);
  console.log(
    `  Heap Used: ${formatBytes(afterMessagesMemory.heapUsed)} (+${formatBytes(afterMessagesMemory.heapUsed - afterClientsMemory.heapUsed)})`
  );

  // Test 3: Cache operations memory usage
  console.log("\n📈 Test 3: Cache Operations");
  for (let i = 0; i < 1000; i++) {
    clients[0].cache.users.set(`user_${i}`, {
      id: `user_${i}`,
      username: `User${i}`,
      avatar: null,
      discriminator: "0001",
      public_flags: 0,
      bot: false,
    });
  }

  const afterCacheMemory = getMemoryUsage();
  console.log(`Memory after caching 1000 users:`);
  console.log(
    `  Heap Used: ${formatBytes(afterCacheMemory.heapUsed)} (+${formatBytes(afterCacheMemory.heapUsed - afterMessagesMemory.heapUsed)})`
  );

  // Cleanup and final memory check
  console.log("\n🧹 Cleanup and Final Check");
  clients.forEach(client => client.destroy());
  messages.length = 0; // Clear array

  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  await new Promise(resolve => setTimeout(resolve, 100)); // Give GC time to run

  const finalMemory = getMemoryUsage();
  console.log(`Final memory usage:`);
  console.log(
    `  Heap Used: ${formatBytes(finalMemory.heapUsed)} (${finalMemory.heapUsed > initialMemory.heapUsed ? "+" : ""}${formatBytes(finalMemory.heapUsed - initialMemory.heapUsed)})`
  );

  console.log("\n📊 Memory Usage Summary:");
  console.log(
    `  Peak Heap Usage: ${formatBytes(Math.max(afterClientsMemory.heapUsed, afterMessagesMemory.heapUsed, afterCacheMemory.heapUsed))}`
  );
  console.log(
    `  Memory Overhead per Client: ~${formatBytes((afterClientsMemory.heapUsed - initialMemory.heapUsed) / 10)}`
  );
  console.log(
    `  Memory per Message: ~${formatBytes((afterMessagesMemory.heapUsed - afterClientsMemory.heapUsed) / 1000)}`
  );
  console.log(
    `  Memory per Cached User: ~${formatBytes((afterCacheMemory.heapUsed - afterMessagesMemory.heapUsed) / 1000)}`
  );
}

// Run with --expose-gc flag for better garbage collection testing
if (process.argv.includes("--expose-gc")) {
  console.log("🗑️  Running with garbage collection exposed");
}

runMemoryBenchmark().catch(console.error);
