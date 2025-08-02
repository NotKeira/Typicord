/**
 * Handler for READY gateway event
 *
 * The READY event is sent when the client has successfully connected to Discord
 * and contains initial session data including user information, guilds, and session details.
 */

import { debug, DebugNamespace } from "@/debug";
import {
  dispatchHandlerRegistry,
  type DispatchHandler,
} from "../DispatchHandlerRegistry";
import { User } from "@/structures/User";
import type { ReadyEvent } from "@/types/gateway/events";

/**
 * Handles the READY gateway event
 * @param client The Typicord client instance
 * @param data The READY event payload
 */
export const handleReady: DispatchHandler<ReadyEvent> = (client, data) => {
  debug.info(DebugNamespace.GATEWAY, "Processing READY event");

  // Extract and store session information
  if (data.session_id) {
    debug.info(
      DebugNamespace.GATEWAY,
      `Session established: ${data.session_id}`
    );
    // Store session info in gateway client (we'll need to expose this)
    (client as any).gateway.sessionId = data.session_id;
  }

  // Extract and store resume gateway URL
  if (data.resume_gateway_url) {
    (client as any).gateway.resumeGatewayUrl = data.resume_gateway_url;
  }

  // Set up client user information
  if (data.user) {
    client.user = new User(data.user);
    debug.log(DebugNamespace.GATEWAY, "Client user information set", {
      id: data.user.id,
      username: data.user.username,
    });
  }

  // Cache all the guilds we're in
  if (data.guilds) {
    client.guilds = data.guilds;
    for (const guild of data.guilds) {
      if (guild.id) {
        client.cache.guilds.set(guild.id, guild);
      }
    }
    debug.log(DebugNamespace.GATEWAY, `Cached ${data.guilds.length} guilds`);
  }

  // Mark as ready and notify reconnection manager
  (client as any).gateway.readyReceived = true;
  (client as any).gateway.reconnectionManager.onConnectionSuccess();

  // Emit the READY event to user listeners (Client will wrap this in ReadyEventData)
  (client as any).emitRaw("READY", data);
};

// Register this handler with the dispatch registry
dispatchHandlerRegistry.registerDispatchHandler("READY", handleReady);
