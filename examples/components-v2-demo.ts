import {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalBuilder,
  createSelectMenuOption,
} from "../src";

// Example bot demonstrating all Components v2 features
async function createComponentsV2Bot() {
  const client = new Client(
    process.env.DISCORD_TOKEN!,
    GatewayIntentBits.Guilds |
      GatewayIntentBits.GuildMessages |
      GatewayIntentBits.MessageContent
  );

  client.on("READY", async data => {
    console.log(`🚀 ${data.user.username} is online with Components v2!`);

    // Initialize commands
    await client.initializeCommands();

    if (client.commands) {
      const guilds = await client.fetchGuilds();
      if (guilds.length > 0) {
        const guildId = guilds[0].id;

        // Create a demo command that shows all component types
        await client.commands.createGuild(guildId, {
          name: "components",
          description: "Demonstrate all Components v2 features",
        });
      }
    }

    console.log("✅ Components v2 demo ready!");
  });

  // Handle slash commands
  client.on("INTERACTION_CREATE", async interaction => {
    if (interaction.type === 2) {
      // APPLICATION_COMMAND
      const command = interaction;

      if (command.commandName === "components") {
        await showComponentsDemo(command);
      }
    }
  });

  // Enhanced message commands for testing
  client.on("MESSAGE_CREATE", async message => {
    if (message.author.bot) return;

    // Button examples
    if (message.content === "!buttons") {
      await showButtonExamples(message);
    }

    // Select menu examples
    if (message.content === "!selects") {
      await showSelectMenuExamples(message);
    }

    // Modal example
    if (message.content === "!modal") {
      await showModalExample(message);
    }

    // Mixed components example
    if (message.content === "!mixed") {
      await showMixedComponentsExample(message);
    }
  });

  // Handle all component interactions
  client.on("INTERACTION_CREATE", async interaction => {
    if (interaction.type === 3) {
      // MESSAGE_COMPONENT
      await handleComponentInteraction(interaction);
    }

    if (interaction.type === 5) {
      // MODAL_SUBMIT
      await handleModalSubmit(interaction);
    }
  });

  // Connect to Discord
  client.connect();
  return client;
}

// Slash command demo showing all components
async function showComponentsDemo(interaction: any) {
  const embed = {
    title: "🎮 Components v2 Demo",
    description: "Try out all the different component types below!",
    color: 0x5865f2,
    fields: [
      {
        name: "🔘 Buttons",
        value: "Various button styles and actions",
        inline: true,
      },
      {
        name: "📝 Select Menus",
        value: "Different types of select menus",
        inline: true,
      },
      { name: "💬 Modal", value: "Text input forms", inline: true },
    ],
  };

  // Create action rows with different component types
  const buttonRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("demo_primary")
        .setLabel("Primary")
        .setStyle(ButtonStyle.PRIMARY),
      new ButtonBuilder()
        .setCustomId("demo_success")
        .setLabel("Success")
        .setStyle(ButtonStyle.SUCCESS),
      new ButtonBuilder()
        .setCustomId("demo_danger")
        .setLabel("Danger")
        .setStyle(ButtonStyle.DANGER),
      new ButtonBuilder()
        .setURL("https://discord.js.org")
        .setLabel("Link")
        .setStyle(ButtonStyle.LINK)
    )
    .toJSON();

  const selectRow = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("demo_string_select")
        .setPlaceholder("Choose an option...")
        .addOptions(
          createSelectMenuOption("Option 1", "opt1", {
            description: "First option",
          }),
          createSelectMenuOption("Option 2", "opt2", {
            description: "Second option",
          }),
          createSelectMenuOption("Option 3", "opt3", {
            description: "Third option",
          })
        )
    )
    .toJSON();

  const userSelectRow = new ActionRowBuilder()
    .addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("demo_user_select")
        .setPlaceholder("Select users...")
        .setMinValues(1)
        .setMaxValues(3)
    )
    .toJSON();

  const roleSelectRow = new ActionRowBuilder()
    .addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("demo_role_select")
        .setPlaceholder("Select roles...")
        .setMaxValues(2)
    )
    .toJSON();

  const modalButtonRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("show_modal")
        .setLabel("🎯 Open Modal")
        .setStyle(ButtonStyle.SECONDARY)
        .setEmoji({ name: "📝" })
    )
    .toJSON();

  await interaction.reply({
    embeds: [embed],
    components: [
      buttonRow,
      selectRow,
      userSelectRow,
      roleSelectRow,
      modalButtonRow,
    ],
  });
}

// Show button examples with message
async function showButtonExamples(message: any) {
  const buttonRow1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("btn_primary")
        .setLabel("Primary")
        .setStyle(ButtonStyle.PRIMARY),
      new ButtonBuilder()
        .setCustomId("btn_secondary")
        .setLabel("Secondary")
        .setStyle(ButtonStyle.SECONDARY),
      new ButtonBuilder()
        .setCustomId("btn_success")
        .setLabel("Success")
        .setStyle(ButtonStyle.SUCCESS),
      new ButtonBuilder()
        .setCustomId("btn_danger")
        .setLabel("Danger")
        .setStyle(ButtonStyle.DANGER)
    )
    .toJSON();

  const buttonRow2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setURL("https://github.com")
        .setLabel("🔗 GitHub")
        .setStyle(ButtonStyle.LINK),
      new ButtonBuilder()
        .setCustomId("btn_disabled")
        .setLabel("Disabled")
        .setStyle(ButtonStyle.SECONDARY)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("btn_emoji")
        .setLabel("With Emoji")
        .setStyle(ButtonStyle.PRIMARY)
        .setEmoji({ name: "🚀" })
    )
    .toJSON();

  await message.reply(
    "🔘 **Button Examples**\nTry clicking the buttons below!",
    {
      components: [buttonRow1, buttonRow2],
    }
  );
}

// Show select menu examples
async function showSelectMenuExamples(message: any) {
  const stringSelectRow = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("string_menu")
        .setPlaceholder("Choose your favorite color...")
        .addOptions(
          createSelectMenuOption("🔴 Red", "red", {
            description: "The color of passion",
          }),
          createSelectMenuOption("🟢 Green", "green", {
            description: "The color of nature",
          }),
          createSelectMenuOption("🔵 Blue", "blue", {
            description: "The color of the sky",
          }),
          createSelectMenuOption("🟡 Yellow", "yellow", {
            description: "The color of sunshine",
          }),
          createSelectMenuOption("🟣 Purple", "purple", {
            description: "The color of royalty",
          })
        )
    )
    .toJSON();

  const userSelectRow = new ActionRowBuilder()
    .addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("user_menu")
        .setPlaceholder("Select users to mention...")
        .setMaxValues(5)
    )
    .toJSON();

  const roleSelectRow = new ActionRowBuilder()
    .addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("role_menu")
        .setPlaceholder("Select roles...")
        .setMinValues(1)
        .setMaxValues(3)
    )
    .toJSON();

  const channelSelectRow = new ActionRowBuilder()
    .addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("channel_menu")
        .setPlaceholder("Select channels...")
        .setChannelTypes([0, 2]) // Text and Voice channels
    )
    .toJSON();

  const mentionableSelectRow = new ActionRowBuilder()
    .addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("mentionable_menu")
        .setPlaceholder("Select users or roles...")
        .setMaxValues(3)
    )
    .toJSON();

  await message.reply(
    "📋 **Select Menu Examples**\nTry the different types of select menus!",
    {
      components: [
        stringSelectRow,
        userSelectRow,
        roleSelectRow,
        channelSelectRow,
        mentionableSelectRow,
      ],
    }
  );
}

// Show modal example (triggered by button)
async function showModalExample(message: any) {
  const button = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("open_feedback_modal")
        .setLabel("📝 Give Feedback")
        .setStyle(ButtonStyle.PRIMARY)
    )
    .toJSON();

  await message.reply(
    "💬 **Modal Example**\nClick the button to open a feedback form!",
    {
      components: [button],
    }
  );
}

// Show mixed components
async function showMixedComponentsExample(message: any) {
  const actionButtons = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("action_save")
        .setLabel("💾 Save")
        .setStyle(ButtonStyle.SUCCESS),
      new ButtonBuilder()
        .setCustomId("action_edit")
        .setLabel("✏️ Edit")
        .setStyle(ButtonStyle.PRIMARY),
      new ButtonBuilder()
        .setCustomId("action_delete")
        .setLabel("🗑️ Delete")
        .setStyle(ButtonStyle.DANGER)
    )
    .toJSON();

  const settingsSelect = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("settings_menu")
        .setPlaceholder("⚙️ Configure settings...")
        .addOptions(
          createSelectMenuOption("🔔 Notifications", "notifications"),
          createSelectMenuOption("🎨 Theme", "theme"),
          createSelectMenuOption("🔒 Privacy", "privacy"),
          createSelectMenuOption("⚡ Performance", "performance")
        )
    )
    .toJSON();

  const adminSelect = new ActionRowBuilder()
    .addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("admin_roles")
        .setPlaceholder("👑 Select admin roles...")
        .setMaxValues(3)
    )
    .toJSON();

  await message.reply(
    "🎛️ **Mixed Components Example**\nA realistic interface with multiple component types!",
    {
      components: [actionButtons, settingsSelect, adminSelect],
    }
  );
}

// Handle all component interactions
async function handleComponentInteraction(interaction: any) {
  // Handle button interactions
  if (interaction.isButton) {
    switch (interaction.customId) {
      case "demo_primary":
      case "demo_success":
      case "demo_danger":
      case "btn_primary":
      case "btn_secondary":
      case "btn_success":
      case "btn_danger":
      case "btn_emoji":
        await interaction.reply({
          content: `🔘 You clicked the **${interaction.customId.split("_")[1]}** button!`,
          ephemeral: true,
        });
        break;

      case "show_modal":
      case "open_feedback_modal":
        await showModal(interaction);
        break;

      case "action_save":
        await interaction.update({
          content: "💾 **Saved!** Your changes have been saved successfully.",
          components: [],
        });
        break;

      case "action_edit":
        await interaction.reply({
          content: "✏️ **Edit mode activated!** You can now make changes.",
          ephemeral: true,
        });
        break;

      case "action_delete":
        await interaction.reply({
          content: "🗑️ **Are you sure?** This action cannot be undone!",
          ephemeral: true,
        });
        break;
    }
  }

  // Handle select menu interactions
  if (interaction.isSelectMenu) {
    if (interaction.isStringSelect) {
      const values = interaction.getSelectedValues();
      await interaction.reply({
        content: `📋 You selected: **${values.join(", ")}**`,
        ephemeral: true,
      });
    }

    if (interaction.isUserSelect) {
      const users = interaction.getSelectedUsers();
      const usernames = users.map((user: any) => user.name).join(", ");
      await interaction.reply({
        content: `👥 You selected users: **${usernames}**`,
        ephemeral: true,
      });
    }

    if (interaction.isRoleSelect) {
      const roles = interaction.getSelectedRoles();
      const roleNames = roles.map((role: any) => role.name).join(", ");
      await interaction.reply({
        content: `🎭 You selected roles: **${roleNames}**`,
        ephemeral: true,
      });
    }

    if (interaction.isChannelSelect) {
      const channels = interaction.getSelectedChannels();
      const channelNames = channels
        .map((channel: any) => channel.name)
        .join(", ");
      await interaction.reply({
        content: `📺 You selected channels: **${channelNames}**`,
        ephemeral: true,
      });
    }

    if (interaction.isMentionableSelect) {
      const values = interaction.getSelectedValues();
      await interaction.reply({
        content: `👋 You selected: **${values.length}** mentionable(s)`,
        ephemeral: true,
      });
    }
  }
}

// Show a modal
async function showModal(interaction: any) {
  const modal = new ModalBuilder()
    .setCustomId("feedback_modal")
    .setTitle("📝 Feedback Form")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("feedback_title")
          .setLabel("Title")
          .setStyle(TextInputStyle.SHORT)
          .setPlaceholder("Brief title for your feedback...")
          .setRequired(true)
          .setMaxLength(100)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("feedback_content")
          .setLabel("Feedback")
          .setStyle(TextInputStyle.PARAGRAPH)
          .setPlaceholder("Tell us what you think...")
          .setRequired(true)
          .setMinLength(10)
          .setMaxLength(1000)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("feedback_rating")
          .setLabel("Rating (1-10)")
          .setStyle(TextInputStyle.SHORT)
          .setPlaceholder("How would you rate your experience?")
          .setRequired(false)
          .setMaxLength(2)
      )
    )
    .toJSON();

  await interaction.showModal(modal);
}

// Handle modal submissions
async function handleModalSubmit(interaction: any) {
  if (interaction.customId === "feedback_modal") {
    const title = interaction.getTextInputValue("feedback_title");
    const content = interaction.getTextInputValue("feedback_content");
    const rating = interaction.getTextInputValue("feedback_rating");

    const embed = {
      title: "📝 Feedback Received",
      fields: [
        { name: "Title", value: title || "No title", inline: false },
        { name: "Content", value: content || "No content", inline: false },
        { name: "Rating", value: rating || "Not provided", inline: true },
      ],
      color: 0x00ff00,
      timestamp: new Date().toISOString(),
    };

    await interaction.reply({
      content: "✅ **Thank you for your feedback!**",
      embeds: [embed],
      ephemeral: true,
    });
  }
}

// Run the bot if executed directly
if (require.main === module) {
  createComponentsV2Bot().catch(console.error);
}

export { createComponentsV2Bot };
