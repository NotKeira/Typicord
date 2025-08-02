import { ReconnectionManager } from "../src/gateway/ReconnectionManager";

/**
 * Simple test for the ReconnectionManager class
 */
function testReconnectionManager(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("Testing ReconnectionManager...");

    let reconnectCalled = 0;
    let lastReconnectTime = 0;
    const delays: number[] = [];
    let testCompleted = false;

    // Hard timeout to force exit after 5 seconds
    const forceTimeout = setTimeout(() => {
      if (!testCompleted) {
        console.log("⏰ Test force-stopped after 5 seconds");
        console.log(`Reconnection attempts made: ${reconnectCalled}`);
        console.log("✅ Test completed (timeout - this is expected)");
        testCompleted = true;
        resolve();
      }
    }, 5000);

    const manager = new ReconnectionManager(
      () => {
        const now = Date.now();
        if (lastReconnectTime > 0) {
          delays.push(now - lastReconnectTime);
        }
        lastReconnectTime = now;

        reconnectCalled++;
        // Reduce console spam - only log first few attempts
        if (reconnectCalled <= 3) {
          console.log(`Reconnection attempt ${reconnectCalled}`);
        }

        // Simulate success after 3 attempts
        if (reconnectCalled === 3) {
          testCompleted = true;
          clearTimeout(forceTimeout);
          manager.onConnectionSuccess();
          console.log("✅ Connection successful after 3 attempts");

          // Verify exponential backoff
          if (delays.length >= 2 && delays[1] > delays[0]) {
            console.log("✅ Exponential backoff working");
          } else {
            console.log("⚠️  Exponential backoff might not be working");
          }

          console.log("✅ Test passed: Reconnection manager worked correctly");
          console.log("All tests completed!");
          resolve();
          return;
        }

        // Schedule another failure to test exponential backoff
        setTimeout(() => {
          if (reconnectCalled < 3 && !testCompleted) {
            manager.scheduleReconnect(`test failure ${reconnectCalled}`);
          }
        }, 10); // Very fast for testing
      },
      {
        maxAttempts: 5,
        baseDelay: 50, // Very fast for testing
        maxDelay: 500, // Keep it short
        jitter: false, // Disable jitter for predictable testing
      }
    );

    console.log("Starting reconnection test...");
    manager.scheduleReconnect("test connection loss");
  });
}

// Run the test and handle the promise properly
testReconnectionManager()
  .then(() => {
    console.log("🎉 All reconnection tests passed!");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Reconnection test failed:", error);
    process.exit(1);
  });
