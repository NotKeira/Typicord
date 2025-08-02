import { Client, GatewayIntentBits } from "../src";

/**
 * Simple example demonstrating the enhanced Discord API wrapper features
 */
async function main() {
  const client = new Client(
    process.env.DISCORD_TOKEN!,
    GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent
  );

  // Track API performance
  client.rest.onAPILatency = (latency, method, endpoint) => {
    console.log(`📊 ${method} ${endpoint}: ${latency}ms`);
  };

  client.on("READY", async data => {
    console.log(`🚀 ${data.user.username} is ready!`);
    console.log(
      `📡 Gateway latency: ${client.gateway.getWebSocketLatency()}ms`
    );

    // Set activity
    client.setActivity({
      name: "Enhanced Typicord",
      type: 0,
      status: "online",
    });

    // Initialize commands
    await client.initializeCommands();

    if (client.commands) {
      // Create a simple ping command
      await client.commands.createGlobal({
        name: "ping",
        description: "Check bot latency",
      });
      console.log("✅ Commands registered");
    }
  });

  // Enhanced message handling
  client.on("MESSAGE_CREATE", async message => {
    if (message.author.bot) return;

    // Simple commands
    if (message.content === "!ping") {
      const reply = await message.reply(
        `🏓 Pong! ${client.gateway.getWebSocketLatency()}ms`
      );
      await reply.react("🏓");
    }

    if (message.content === "!info") {
      const channel = await client.fetchChannel(message.channelId);
      await message.reply(`📋 Channel: ${channel.name}, Type: ${channel.type}`);
    }

    if (message.content === "!edit") {
      const msg = await message.reply("Original message");
      setTimeout(async () => {
        await msg.edit("✏️ Edited message!");
      }, 2000);
    }
  });

  // Handle slash commands
  client.on("INTERACTION_CREATE", async interaction => {
    if (interaction.type === 2) {
      // Application command
      if ((interaction as any).commandName === "ping") {
        await (interaction as any).reply({
          content: `🏓 Pong! ${client.gateway.getWebSocketLatency()}ms`,
          ephemeral: true,
        });
      }
    }
  });

  client.connect();
}

if (require.main === module) {
  main().catch(console.error);
}

export { main };
