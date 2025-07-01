import Benchmark from "benchmark";
import { ReconnectionManager } from "../src/gateway/ReconnectionManager";
import { HeartbeatManager } from "../src/gateway/HeartbeatManager";

const suite = new Benchmark.Suite();

// Mock WebSocket for HeartbeatManager testing
const mockWS = {
  send: () => {},
  readyState: 1, // OPEN
} as any;

// Benchmark reconnection manager operations
suite.add("ReconnectionManager creation", () => {
  const mockReconnect = () => {};
  new ReconnectionManager(mockReconnect).getAttempts();
});

suite.add("Exponential backoff calculation", () => {
  const mockReconnect = () => {};
  const manager = new ReconnectionManager(mockReconnect);
  // Just test the creation/initialization, not actual scheduling
  // since scheduleReconnect starts timers that can hang the benchmark

});

suite.add("Reconnection manager reset", () => {
  const mockReconnect = () => {};
  const manager = new ReconnectionManager(mockReconnect);
  // Test successful connection which resets the manager
  manager.onConnectionSuccess();
});

// Benchmark heartbeat manager operations
suite.add("HeartbeatManager creation", () => {
  const mockOnMissed = () => {};
  new HeartbeatManager(mockWS, 45000, mockOnMissed); // 45s interval like Discord
});

suite.add("Heartbeat latency calculation", () => {
  const mockOnMissed = () => {};
  const hb = new HeartbeatManager(mockWS, 45000, mockOnMissed);
  hb.start();
  // Simulate ACK received
  hb.onHeartbeatAck();
  const latency = hb.getWebSocketLatency();
  hb.stop();
});

// Benchmark gateway payload processing (common JSON operations)
suite.add("Gateway payload creation", () => {
  const payload = {
    op: 1, // Heartbeat
    d: null,
    s: null,
    t: null,
  };
  JSON.stringify(payload);
});

suite.add("Large gateway payload parsing", () => {
  // Simulate a large READY payload
  const readyPayload = {
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
      guilds: Array(50)
        .fill(null)
        .map((_, i) => ({
          id: `${9876543210987654321 + i}`,
          name: `Test Guild ${i + 1}`,
          icon: "guild_icon_hash",
          permissions: "2147483647",
          features: [],
        })),
      session_id: "session_id_here",
      resume_gateway_url: "wss://gateway.discord.gg",
    },
  };
  const json = JSON.stringify(readyPayload);
  JSON.parse(json);
});

// Benchmark WebSocket message handling simulation
suite.add("WebSocket message handling", () => {
  const rawMessage = JSON.stringify({
    op: 0,
    s: 123,
    t: "MESSAGE_CREATE",
    d: {
      id: "1234567890123456789",
      content: "Hello world!",
      author: {
        id: "9876543210987654321",
        username: "User",
        avatar: null,
        discriminator: "1234",
        bot: false,
      },
    },
  });

  // Simulate what happens when we receive a message
  const parsed = JSON.parse(rawMessage);
  const { op, s, t, d } = parsed;

  // Basic validation that would happen
  if (typeof op === "number" && typeof s === "number") {
    // Message is valid
  }
});

// Add event listeners
suite
  .on("cycle", (event: any) => {
    console.log(String(event.target));
  })
  .on("complete", function (this: any) {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  });

// Run the benchmark
console.log("⚡ Running Gateway Performance Benchmarks...\n");
suite.run({ async: true });
