import Benchmark from "benchmark";
import { ReconnectionManager } from "../src/gateway/ReconnectionManager";
import { HeartbeatManager } from "../src/gateway/HeartbeatManager";

const suite = new Benchmark.Suite("Gateway Performance", {
  // Reduce sample time for faster benchmarks
  defer: false,
  minSamples: 10,
  maxTime: 1, // 1 second per benchmark max
});

// Pre-create objects for reuse to avoid allocation overhead
const mockWS = {
  send: () => {},
  readyState: 1, // OPEN
} as any;

const mockReconnect = () => {};
const baseReconnectionManager = new ReconnectionManager(mockReconnect);

// Benchmark manager operations
suite.add("ReconnectionManager.getAttempts()", () => {
  baseReconnectionManager.getAttempts();
});

suite.add("ReconnectionManager.onConnectionSuccess()", () => {
  const manager = new ReconnectionManager(mockReconnect);
  manager.onConnectionSuccess();
});

suite.add("HeartbeatManager creation + start/stop", () => {
  const hb = new HeartbeatManager(mockWS, 5000, mockReconnect); // Short interval for testing
  hb.start();
  hb.stop();
});

suite.add("HeartbeatManager.getWebSocketLatency()", () => {
  const hb = new HeartbeatManager(mockWS, 5000, mockReconnect);
  hb.start();
  hb.onHeartbeatAck();
  hb.getWebSocketLatency();
  hb.stop();
});

// Pre-create payloads for consistent benchmarking
const smallPayload = {
  op: 1, // Heartbeat
  d: null,
  s: null,
  t: null,
};

const mediumPayload = {
  op: 0,
  s: 1,
  t: "MESSAGE_CREATE",
  d: {
    id: "1234567890123456789",
    content: "Hello world! This is a test message with some content.",
    author: {
      id: "987654321098765432",
      username: "TestUser",
      avatar: "avatar_hash_here",
      discriminator: "1234",
      bot: false,
    },
    timestamp: "2023-01-01T00:00:00.000Z",
    edited_timestamp: null,
    tts: false,
    mention_everyone: false,
    mentions: [],
    mention_roles: [],
    attachments: [],
    embeds: [],
  },
};

const largePayload = {
  op: 0,
  s: 1,
  t: "READY",
  d: {
    v: 10,
    user: {
      id: "1234567890123456789",
      username: "TestBot",
      avatar: "avatar_hash",
      discriminator: "0000",
      bot: true,
    },
    guilds: Array(20) // Reduced from 50 for faster benchmarks
      .fill(null)
      .map((_, i) => ({
        id: `12345678901234567${String(i).padStart(2, '0')}`, // Fixed precision issue
        name: `Guild ${i + 1}`,
        icon: "guild_icon_hash",
        permissions: "2147483647",
        features: ["COMMUNITY", "NEWS"],
      })),
    session_id: "session_id_here",
    resume_gateway_url: "wss://gateway.discord.gg",
  },
};

// Benchmark JSON operations
suite.add("JSON.stringify small payload", () => {
  JSON.stringify(smallPayload);
});

suite.add("JSON.stringify medium payload", () => {
  JSON.stringify(mediumPayload);
});

suite.add("JSON.stringify large payload", () => {
  JSON.stringify(largePayload);
});

// Pre-stringify for parse benchmarks
const smallJson = JSON.stringify(smallPayload);
const mediumJson = JSON.stringify(mediumPayload);
const largeJson = JSON.stringify(largePayload);

suite.add("JSON.parse small payload", () => {
  JSON.parse(smallJson);
});

suite.add("JSON.parse medium payload", () => {
  JSON.parse(mediumJson);
});

suite.add("JSON.parse large payload", () => {
  JSON.parse(largeJson);
});

// Pre-create message for consistent benchmarking
const rawMessage = JSON.stringify({
  op: 0,
  s: 123,
  t: "MESSAGE_CREATE",
  d: {
    id: "1234567890123456789",
    content: "Hello world!",
    author: {
      id: "987654321098765432",
      username: "User",
      avatar: null,
      discriminator: "1234",
      bot: false,
    },
  },
});

// Benchmark message processing pipeline
suite.add("WebSocket message parse + validate", () => {
  const parsed = JSON.parse(rawMessage);
  const { op, s } = parsed;
  
  // Basic validation that would happen in real usage
  if (typeof op === "number" && typeof s === "number") {
    // Message is valid - this would trigger event handling
    return true;
  }
  return false;
});

// Event listeners with cleaner output
suite
  .on("cycle", (event: any) => {
    const target = event.target;
    const opsPerSecond = Benchmark.formatNumber(target.hz.toFixed(0));
    console.log(`${target.name}: ${opsPerSecond} ops/sec ±${(target.stats.rme || 0).toFixed(2)}%`);
  })
  .on("complete", function (this: any) {
    console.log(`\n🏆 Fastest: ${this.filter("fastest").map("name")}`);
    console.log("✅ Gateway benchmarks completed!");
  });

// Run optimized benchmark
console.log("⚡ Running Gateway Performance Benchmarks (fast mode)...\n");
suite.run({ async: false }); // Synchronous for faster completion
