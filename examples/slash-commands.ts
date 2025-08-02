/**
 * Slash Commands Example
 *
 * This example demonstrates:
 * - Handling interaction events
 * - Responding to slash commands
 * - Working with interaction data
 */

import { Client, GatewayIntentBits, Events } from "../src";

const client = new Client("YOUR_BOT_TOKEN", GatewayIntentBits.Guilds);

client.on("READY", (ready: Events.Ready) => {
  console.log(`🚀 Bot ready as ${ready.user.username}`);
  console.log(
    "💡 Remember to register slash commands via Discord Developer Portal or REST API"
  );
});

client.on("INTERACTION_CREATE", (interaction: Events.InteractionCreate) => {
  // Handle slash commands (APPLICATION_COMMAND type)
  if (interaction.type === 2) {
    // Respond to different commands based on interaction data
    // Note: This is a simplified example - actual command parsing would be more complex

    // Simple response to any interaction
    client.rest
      .post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: "👋 Hello from Typicord! This is a slash command response.",
          embeds: [
            {
              title: "🎉 Interaction Received",
              description: "Successfully handled your slash command!",
              color: 0x5865f2,
              fields: [
                {
                  name: "Interaction ID",
                  value: interaction.id,
                  inline: true,
                },
                {
                  name: "Type",
                  value: interaction.type.toString(),
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
          flags: 64, // EPHEMERAL - only visible to command user
        },
      })
      .catch(console.error);
  }

  // Handle button interactions
  if (interaction.type === 3) {
    client.rest
      .post(`/interactions/${interaction.id}/${interaction.token}/callback`, {
        type: 4,
        data: {
          content: "� Button clicked! This is a component interaction.",
          flags: 64,
        },
      })
      .catch(console.error);
  }
});

client.connect();
