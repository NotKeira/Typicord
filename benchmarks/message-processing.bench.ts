import Benchmark from "benchmark";
import { Message } from "../src/structures/Message";
import { Client } from "../src/client/Client";
import { GatewayIntentBits } from "../src/client/Client";

const suite = new Benchmark.Suite();

// Create a mock client for testing
const mockClient = new Client("fake-token", GatewayIntentBits.GuildMessages);

// Sample Discord message data for benchmarking
const sampleMessageData = {
  id: "1234567890123456789",
  channel_id: "9876543210987654321",
  content: "Hello, this is a test message!",
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

// Benchmark message structure creation
suite.add("Message structure creation", () => {
  new Message(mockClient, sampleMessageData);
});

// Benchmark message data parsing
suite.add("Message data parsing", () => {
  const msg = new Message(mockClient, sampleMessageData);
  // Access common properties
  msg.id;
  msg.content;
  msg.author;
  msg.timestamp;
  msg.channelId;
});

// Benchmark cache operations
suite.add("User cache operations", () => {
  const userId = "1111111111111111111";
  mockClient.cache.users.set(userId, sampleMessageData.author);
  mockClient.cache.users.get(userId);
  mockClient.cache.users.has(userId);
});

// Benchmark multiple message processing (simulating a burst)
const multipleMessages = Array(100)
  .fill(null)
  .map((_, i) => ({
    ...sampleMessageData,
    id: `${1234567890123456789 + i}`,
    content: `Message ${i + 1}`,
  }));

suite.add("Process 100 messages", () => {
  multipleMessages.forEach(data => {
    new Message(mockClient, data);
  });
});

// Benchmark event emission (using EventEmitter directly)
suite.add("Event emission", () => {
  const msg = new Message(mockClient, sampleMessageData);
  // Simulate what the client does internally
  (mockClient as any).emit("MESSAGE_CREATE", msg);
});

// Add event listeners
suite
  .on("cycle", (event: any) => {
    console.log(String(event.target));
  })
  .on("complete", function (this: any) {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    mockClient.destroy(); // Clean up
  });

// Run the benchmark
console.log("🏗️  Running Message Processing Performance Benchmarks...\n");
suite.run({ async: true });
