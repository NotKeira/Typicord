import Benchmark from "benchmark";
import { RESTClient } from "../src/client/RESTClient";

const suite = new Benchmark.Suite();

// Set up a REST client for testing
const rest = new RESTClient({
  token: "fake-token-for-benchmarking",
  baseURL: "https://httpbin.org", // Using httpbin for safe testing
});

// Benchmark REST client initialization
suite.add("RESTClient initialization", () => {
  new RESTClient({ token: "test-token" });
});

// Benchmark header construction (what happens before each request)
suite.add("Request header construction", () => {
  const headers = {
    Authorization: `Bot fake-token`,
    "User-Agent": `DiscordBot (https://git.keira.boo/Typicord, 1.0.0) Node.js/${process.version}`,
    "Content-Type": "application/json",
  };
  JSON.stringify({ test: "data" });
});

// Benchmark rate limit checking
suite.add("Rate limit checking", () => {
  // Simulate what happens internally
  const rateLimits = new Map<string, number>();
  const endpoint = "/test/endpoint";
  const until = rateLimits.get(endpoint);
  const isLimited = until && Date.now() < until;
});

// Benchmark JSON parsing (common operation)
suite.add("JSON parsing (small payload)", () => {
  const json =
    '{"id":"123","content":"Hello world","timestamp":"2025-06-30T00:00:00.000Z"}';
  JSON.parse(json);
});

suite.add("JSON parsing (large payload)", () => {
  const largeObject = {
    id: "123456789",
    content:
      "This is a much longer message content that might be typical in Discord",
    author: {
      id: "987654321",
      username: "TestUser",
      avatar: "avatar_hash",
      discriminator: "1234",
    },
    embeds: [
      {
        title: "Test Embed",
        description: "This is a test embed with some content",
        fields: [
          { name: "Field 1", value: "Value 1", inline: true },
          { name: "Field 2", value: "Value 2", inline: true },
        ],
      },
    ],
    timestamp: "2025-06-30T00:00:00.000Z",
  };
  const json = JSON.stringify(largeObject);
  JSON.parse(json);
});

// Add event listeners
suite
  .on("cycle", (event: any) => {
    console.log(String(event.target));
  })
  .on("complete", function (this: any) {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    rest.destroy(); // Clean up
  });

// Run the benchmark
console.log("🚀 Running REST Client Performance Benchmarks...\n");
suite.run({ async: true });
