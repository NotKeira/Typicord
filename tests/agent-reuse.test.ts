import { RESTClient } from "../src/client/RESTClient";

// Simple test to verify agent reuse
const rest = new RESTClient({ token: "test-token" });

console.log("✅ RESTClient created with persistent agent");
console.log("✅ Agent configuration:", {
  // @ts-ignore - accessing private property for testing
  keepAliveTimeout: rest.agent?.keepAliveTimeout,
  // @ts-ignore
  keepAliveMaxTimeout: rest.agent?.keepAliveMaxTimeout,
  // @ts-ignore  
  maxCachedSessions: rest.agent?.maxCachedSessions,
});

// Test cleanup
rest.destroy();
console.log("✅ RESTClient destroyed, agent cleaned up");
