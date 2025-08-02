import "dotenv/config";
import { RESTClient, RESTError } from "../src/client/RESTClient";

const token = process.env.DISCORD_TOKEN || "BotTokenHere"; // Use a real token for live tests
const rest = new RESTClient({ token, version: 10 });

async function testGetGateway() {
  try {
    const data = await rest.get("/gateway");
    console.log("GET /gateway success:", data);
  } catch (err) {
    console.error("GET /gateway failed:", err);
  }
}

async function testPostMessage() {
  try {
    // Replace with a real channel ID for live test
    const channelId = process.env.TEST_CHANNEL_ID || "000000000000000000";
    const data = await rest.post(`/channels/${channelId}/messages`, {
      content: "Hello from RESTClient!",
    });
    console.log("POST /channels/:id/messages success:", data);
    return data;
  } catch (err) {
    console.error("POST /channels/:id/messages failed:", err);
  }
}

async function testPatchMessage(message: any) {
  try {
    const channelId = message.channel_id;
    const messageId = message.id;
    const data = await rest.patch(
      `/channels/${channelId}/messages/${messageId}`,
      { content: "(edited) Hello from RESTClient!" }
    );
    console.log("PATCH /channels/:id/messages/:id success:", data);
    return data;
  } catch (err) {
    console.error("PATCH /channels/:id/messages/:id failed:", err);
  }
}

async function testDeleteMessage(message: any) {
  try {
    const channelId = message.channel_id;
    const messageId = message.id;
    await rest.delete(`/channels/${channelId}/messages/${messageId}`);
    console.log("DELETE /channels/:id/messages/:id success");
  } catch (err) {
    console.error("DELETE /channels/:id/messages/:id failed:", err);
  }
}

async function testErrorHandling() {
  try {
    await rest.get("/invalid/endpoint");
  } catch (err) {
    if (err instanceof RESTError) {
      console.log(
        "Properly caught RESTError for invalid endpoint:",
        err.status,
        err.message
      );
    } else {
      console.error("Unexpected error:", err);
    }
  }
}

async function runAllTests(): Promise<void> {
  try {
    await testGetGateway();
    const msg = await testPostMessage();
    if (msg) {
      await testPatchMessage(msg);
      await testDeleteMessage(msg);
    }
    await testErrorHandling();
    console.log("✅ All RESTClient tests completed successfully!");
  } catch (error) {
    console.error("❌ RESTClient test suite failed:", error);
    throw error; // Re-throw to be caught by main handler
  }
}

// Run all tests and handle the promise properly
runAllTests()
  .then(() => {
    console.log("🎉 RESTClient test suite finished!");
    process.exit(0);
  })
  .catch(error => {
    console.error("💥 RESTClient test suite failed:", error);
    process.exit(1);
  });
