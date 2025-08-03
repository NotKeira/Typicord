import {
  Client,
  GatewayIntentBits,
  ApplicationCommandOptionType,
  ComponentType,
  ButtonStyle,
} from "typicord";

// Helper functions to reduce cognitive complexity
async function handlePingCommand(command: any, client: any) {
  await command.reply({
    content: `🏓 Pong! Gateway: ${client.gateway.getWebSocketLatency()}ms`,
    ephemeral: true,
  });
}

async function handleKickCommand(command: any, client: any, interaction: any) {
  const user = command.getUserOption("user");
  const reason = command.getString("reason") || "No reason provided";

  if (!user) {
    await command.reply({
      content: "❌ User not found!",
      ephemeral: true,
    });
    return;
  }

  if (!interaction.guildId) {
    await command.reply({
      content: "❌ This command can only be used in a server!",
      ephemeral: true,
    });
    return;
  }

  try {
    const guild = await client.fetchGuild(interaction.guildId);
    await guild.kickMember(user.id, reason);

    await command.reply({
      content: `✅ Successfully kicked ${user.username}. Reason: ${reason}`,
    });
  } catch (error) {
    await command.reply({
      content: `❌ Failed to kick user: ${error}`,
      ephemeral: true,
    });
  }
}

async function handleChannelCommand(
  command: any,
  client: any,
  interaction: any
) {
  if (!interaction.guildId) {
    await command.reply({
      content: "❌ This command can only be used in a server!",
      ephemeral: true,
    });
    return;
  }

  const subcommand = command.subcommand;
  const guild = await client.fetchGuild(interaction.guildId);

  if (subcommand === "create") {
    const name = command.getString("name")!;
    const type = command.getInteger("type") || 0;

    try {
      const channel = await guild.createChannel(name, { type });
      await command.reply({
        content: `✅ Created channel: <#${channel.id}>`,
      });
    } catch (error) {
      await command.reply({
        content: `❌ Failed to create channel: ${error}`,
        ephemeral: true,
      });
    }
  } else if (subcommand === "delete") {
    const channelData = command.getChannel("channel");

    if (!channelData) {
      await command.reply({
        content: "❌ Channel not found!",
        ephemeral: true,
      });
      return;
    }

    try {
      const channel = await client.fetchChannel(channelData.id);
      await channel.delete("Deleted via slash command");

      await command.reply({
        content: `✅ Successfully deleted channel: ${channelData.name}`,
      });
    } catch (error) {
      await command.reply({
        content: `❌ Failed to delete channel: ${error}`,
        ephemeral: true,
      });
    }
  }
}

// Example bot that demonstrates all the new features
async function createAdvancedBot() {
  const client = new Client(
    process.env.DISCORD_TOKEN!,
    GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent
  );

  // Set up API latency tracking
  client.rest.onAPILatency = (latency, method, endpoint) => {
    if (latency > 500) {
      console.warn(
        `⚠️ Slow API request: ${method} ${endpoint} took ${latency}ms`
      );
    }
  };

  // Ready event - set up commands
  client.on("READY", async data => {
    console.log(`🚀 ${data.user.username} is online!`);
    console.log(
      `📊 Gateway latency: ${client.gateway.getWebSocketLatency()}ms`
    );

    // Set bot activity
    client.setActivity({
      name: "with advanced features!",
      type: 0, // Playing
      status: "online",
    });

    // Initialize slash commands
    await client.initializeCommands();

    // Create some example commands
    if (client.commands) {
      // Global ping command
      await client.commands.createGlobal({
        name: "ping",
        description: "Get bot latency information",
      });

      // Guild-specific moderation command
      const guilds = await client.fetchGuilds();
      if (guilds.length > 0) {
        const guildId = guilds[0].id;

        await client.commands.createGuild(guildId, {
          name: "kick",
          description: "Kick a member from the server",
          options: [
            {
              type: ApplicationCommandOptionType.USER,
              name: "user",
              description: "User to kick",
              required: true,
            },
            {
              type: ApplicationCommandOptionType.STRING,
              name: "reason",
              description: "Reason for the kick",
              required: false,
            },
          ],
          default_member_permissions: "2", // KICK_MEMBERS permission
        });

        // Channel management command
        await client.commands.createGuild(guildId, {
          name: "channel",
          description: "Manage channels",
          options: [
            {
              type: ApplicationCommandOptionType.SUB_COMMAND,
              name: "create",
              description: "Create a new channel",
              options: [
                {
                  type: ApplicationCommandOptionType.STRING,
                  name: "name",
                  description: "Name of the channel",
                  required: true,
                },
                {
                  type: ApplicationCommandOptionType.INTEGER,
                  name: "type",
                  description: "Type of channel",
                  required: false,
                  choices: [
                    { name: "Text Channel", value: 0 },
                    { name: "Voice Channel", value: 2 },
                  ],
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.SUB_COMMAND,
              name: "delete",
              description: "Delete a channel",
              options: [
                {
                  type: ApplicationCommandOptionType.CHANNEL,
                  name: "channel",
                  description: "Channel to delete",
                  required: true,
                },
              ],
            },
          ],
          default_member_permissions: "16", // MANAGE_CHANNELS permission
        });
      }
    }

    console.log("✅ Commands registered successfully!");
  });

  // Handle slash command interactions
  client.on("INTERACTION_CREATE", async interaction => {
    if (interaction.type === 2) {
      // APPLICATION_COMMAND
      const command = interaction; // CommandInteraction

      try {
        switch (command.commandName) {
          case "ping": {
            await handlePingCommand(command, client);
            break;
          }

          case "kick": {
            await handleKickCommand(command, client, interaction);
            break;
          }

          case "channel": {
            await handleChannelCommand(command, client, interaction);
            break;
          }

          default: {
            await command.reply({
              content: "❌ Unknown command!",
              ephemeral: true,
            });
            break;
          }
        }
      } catch (error) {
        console.error("Error handling interaction:", error);

        if (!command.responded && !command.deferred) {
          await command.reply({
            content: "❌ An error occurred while processing your command.",
            ephemeral: true,
          });
        }
      }
    }
  });

  // Enhanced message handling with new features
  client.on("MESSAGE_CREATE", async message => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Simple ping command
    if (message.content === "!ping") {
      const reply = await message.reply(
        `🏓 Pong! Gateway: ${client.gateway.getWebSocketLatency()}ms`
      );

      // Add reactions
      await reply.react("🏓");
      await reply.react("⚡");
    }

    // Channel info command
    if (message.content === "!channelinfo") {
      try {
        const channel = await client.fetchChannel(message.channelId);

        const embed = {
          title: "📋 Channel Information",
          fields: [
            { name: "Name", value: channel.name || "Unknown", inline: true },
            { name: "Type", value: channel.type.toString(), inline: true },
            { name: "NSFW", value: channel.nsfw ? "Yes" : "No", inline: true },
          ],
          color: 0x5865f2,
        };

        await message.reply("", { embeds: [embed] });
      } catch (error) {
        console.error("Channel info error:", error);
        await message.reply("❌ Failed to fetch channel information.");
      }
    }

    // Interactive button example
    if (message.content === "!buttons") {
      const components = [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.PRIMARY,
              label: "Primary",
              custom_id: "button_primary",
            },
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.SUCCESS,
              label: "Success",
              custom_id: "button_success",
            },
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.DANGER,
              label: "Danger",
              custom_id: "button_danger",
            },
          ],
        },
      ];

      await message.reply("🔘 Click a button below:", {
        components,
      });
    }

    // Advanced message features demo
    if (message.content === "!features") {
      const msg = await message.reply("🔄 Demonstrating message features...");

      // Edit the message
      setTimeout(async () => {
        await msg.edit("✏️ Message edited!");
      }, 2000);

      // Add reactions
      await msg.react("👍");
      await msg.react("👎");

      // Pin the message
      setTimeout(async () => {
        try {
          await msg.pin();
        } catch (error) {
          console.log("Failed to pin message:", error);
        }
      }, 4000);
    }
  });

  // Handle button interactions
  client.on("INTERACTION_CREATE", async interaction => {
    if (interaction.type === 3) {
      // MESSAGE_COMPONENT
      const component = interaction; // ComponentInteraction

      if (component.isButton) {
        const responses = {
          button_primary: "🔵 You clicked the Primary button!",
          button_success: "🟢 You clicked the Success button!",
          button_danger: "🔴 You clicked the Danger button!",
        };

        const response =
          responses[component.customId as keyof typeof responses];

        if (response) {
          await component.reply({
            content: response,
            ephemeral: true,
          });
        }
      }
    }
  });

  // Connect to Discord
  client.connect();

  return client;
}

// Only run if this file is executed directly
if (require.main === module) {
  createAdvancedBot().catch(console.error);
}

export { createAdvancedBot };
