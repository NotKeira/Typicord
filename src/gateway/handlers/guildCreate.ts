/**
 * Handler for GUILD_CREATE gateway event
 *
 * The GUILD_CREATE event is sent when the bot joins a guild or when a guild
 * becomes available after being previously unavailable.
 */

import { debug, DebugNamespace } from "@/debug";
import {
  dispatchHandlerRegistry,
  type DispatchHandler,
} from "../DispatchHandlerRegistry";
import type { Guild } from "@/types/structures/guild";

/**
 * Handles the GUILD_CREATE gateway event
 * @param client The Typicord client instance
 * @param data The GUILD_CREATE event payload
 */
export const handleGuildCreate: DispatchHandler<Guild> = (client, data) => {
  debug.log(DebugNamespace.EVENTS, "Processing GUILD_CREATE event", {
    guildId: data.id,
    guildName: data.name,
  });

  const guildId = data.id;
  const readyReceived = client.gateway.readyReceived;

  if (!readyReceived || !client.cache.guilds.has(guildId)) {
    // During startup or when joining a new guild
    client.cache.guilds.set(guildId, data);
    debug.log(DebugNamespace.EVENTS, `Cached guild: ${data.name} (${guildId})`);

    // Emit the GUILD_CREATE event to user listeners (Client will wrap this in GuildCreateEventData)
    client.emitRaw("GUILD_CREATE", data);
  } else {
    // If we already know about this guild, ignore it
    debug.trace(
      DebugNamespace.EVENTS,
      `Guild ${guildId} already cached, ignoring GUILD_CREATE`
    );
  }
};

// Register this handler with the dispatch registry
dispatchHandlerRegistry.registerDispatchHandler(
  "GUILD_CREATE",
  handleGuildCreate
);
