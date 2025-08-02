// Skip integration tests in CI environment
if (process.env.SKIP_INTEGRATION_TESTS === 'true') {
  console.log('⏭️  Skipping integration tests (SKIP_INTEGRATION_TESTS=true)');
  process.exit(0);
}

import { GatewayClient } from "../src/gateway/GatewayClient";
// import { Message } from "../src/types/gateway/structures/Message";
import { Message } from "../src/structures/Message";
import { GatewayIntentBits, Client } from "../src/client/Client";

const token =
  "MTE0OTMzMzgyNjQ2MDQ1OTA4NA.G_bJBl.qX375QGTgGYSw1OarU9GPydI0GhLn9xMkg_70M";
const intents =
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMembers |
  GatewayIntentBits.GuildMessages |
  GatewayIntentBits.GuildMessageReactions |
  GatewayIntentBits.GuildMessageTyping |
  GatewayIntentBits.DirectMessages |
  GatewayIntentBits.DirectMessageReactions |
  GatewayIntentBits.DirectMessageTyping |
  GatewayIntentBits.MessageContent;

const client = new Client(token, intents);

client.on("MESSAGE_CREATE", async (msg: Message) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith("!")) return;

  const [command] = msg.content.slice(1).split(/\s+/);

  if (command === "ping") {
    const sent = Date.now();
    const reply = await msg.reply("Pinging...");
    const apiLatency = Date.now() - sent;
    const wsLatency = client.gateway.getPing?.() ?? -1;

    await reply.edit(`🏓 Pong!
API Latency: ${apiLatency}ms
WebSocket Latency: ${`${wsLatency}ms`}`);
  }
});

client.on("GUILD_CREATE", (data) => {
  console.log(`Joined guild: ${data.name} (${data.id})`);
});

client.on("READY", (data) => {
  console.log(`Logged in as ${data.user.username}#${data.user.discriminator}`);
  console.log(`User ID: ${data.user.id}`);
  console.log(`Guilds: ${data.guilds.length}`);
});

client.connect();
