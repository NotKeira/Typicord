/**
 * Guild Management Example
 *
 * This example demonstrates:
 * - Handling guild events (GUILD_CREATE, GUILD_UPDATE, GUILD_DELETE)
 * - Fetching guild information
 * - Working with guild cache
 * - Managing guild operations
 */

import { Client, GatewayIntentBits, Events } from "../src";

const client = new Client(
  "YOUR_BOT_TOKEN",
  GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages
);

client.on("READY", async (ready: Events.Ready) => {
  console.log(`🚀 Bot ready as ${ready.user.username}`);
  console.log(`📊 Initially connected to ${ready.guilds.length} guilds`);

  // Fetch detailed information about all guilds
  try {
    const guilds = await client.fetchGuilds({ with_counts: true });
    console.log("\n🏰 Guild Information:");
    guilds.forEach(guild => {
      console.log(`  • ${guild.name} (${guild.id})`);
    });
  } catch (error) {
    console.error("❌ Failed to fetch guilds:", error);
  }
});

// Handle when the bot joins a new guild
client.on("GUILD_CREATE", (guild: Events.GuildCreate) => {
  console.log(`➕ Joined new guild: ${guild.guild.name} (${guild.guild.id})`);
  console.log(`   👥 Owner: ${guild.ownerId}`);
  console.log(`   👑 Is Owner: ${guild.isOwner ? "Yes" : "No"}`);

  // You could send a welcome message to the guild's system channel here
  // or log the event to a database
});

// Handle guild updates (name changes, settings changes, etc.)
client.on("GUILD_UPDATE", (guild: Events.GuildUpdate) => {
  console.log(`🔄 Guild updated: ${guild.guild.name} (${guild.guild.id})`);

  // Compare with cached version to see what changed
  const cachedGuild = client.cache.guilds.get(guild.guild.id);
  if (cachedGuild && cachedGuild.name !== guild.guild.name) {
    console.log(
      `   📝 Name changed from "${cachedGuild.name}" to "${guild.guild.name}"`
    );
  }
});

// Handle when the bot is removed from a guild
client.on("GUILD_DELETE", (guild: Events.GuildDelete) => {
  if (guild.data.unavailable) {
    console.log(`⚠️ Guild temporarily unavailable: ${guild.data.id}`);
  } else {
    console.log(`➖ Removed from guild: ${guild.data.id}`);
    // Clean up any guild-specific data or settings
  }
});

// Handle messages to demonstrate guild context
client.on("MESSAGE_CREATE", async (message: Events.MessageCreate) => {
  if (message.author.bot) return;

  // Guild info command
  if (message.content === "!guildinfo") {
    if (!message.guildId) {
      await client.sendMessage(
        message.channelId,
        "❌ This command can only be used in a guild!"
      );
      return;
    }

    try {
      const guild = await client.fetchGuild(message.guildId);

      await client.sendMessage(message.channelId, "Guild information:", {
        embeds: [
          {
            title: `🏰 ${guild.name}`,
            fields: [
              {
                name: "🆔 Guild ID",
                value: guild.id,
                inline: true,
              },
              {
                name: "👑 Owner",
                value: `<@${guild.ownerId}>`,
                inline: true,
              },
              {
                name: "📅 Created",
                value: new Date(
                  Number(BigInt(guild.id) >> 22n) + 1420070400000
                ).toLocaleDateString(),
                inline: true,
              },
            ],
            color: 0x5865f2,
            thumbnail: guild.icon
              ? {
                  url: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`,
                }
              : undefined,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch guild info:", error);
      await client.sendMessage(
        message.channelId,
        "❌ Failed to fetch guild information."
      );
    }
  }

  // List all guilds (owner only command)
  if (
    message.content === "!listguilds" &&
    message.author.id === "YOUR_USER_ID"
  ) {
    try {
      const guilds = await client.fetchGuilds();
      const guildList = guilds
        .slice(0, 10)
        .map((g, i) => `${i + 1}. ${g.name} (${g.id})`)
        .join("\n");

      await client.sendMessage(message.channelId, "Bot guild list:", {
        embeds: [
          {
            title: "🏰 Bot Guilds",
            description:
              guildList +
              (guilds.length > 10
                ? `\n\n... and ${guilds.length - 10} more`
                : ""),
            footer: {
              text: `Total: ${guilds.length} guilds`,
            },
          },
        ],
      });
    } catch (error) {
      console.error("Failed to list guilds:", error);
    }
  }
});

client.connect();
