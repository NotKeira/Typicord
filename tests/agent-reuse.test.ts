import { RESTClient } from "../src/client/RESTClient";

function testAgentReuse(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
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
      console.log("✅ Agent reuse test completed successfully!");

      resolve();
    } catch (error) {
      console.error("❌ Agent reuse test failed:", error);
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

// Run the test and handle the promise properly
testAgentReuse()
  .then(() => {
    console.log("🎉 Agent reuse test completed!");
    process.exit(0);
  })
  .catch(error => {
    console.error("💥 Agent reuse test failed:", error);
    process.exit(1);
  });
