/**
 * Handler for INTERACTION_CREATE gateway event
 *
 * The INTERACTION_CREATE event is sent when a user interacts with the bot
 * through slash commands, buttons, select menus, etc.
 */

import { debug, DebugNamespace } from "@/debug";
import {
  dispatchHandlerRegistry,
  type DispatchHandler,
} from "../DispatchHandlerRegistry";
import type { RawInteractionData } from "@/types/gateway/interaction";

/**
 * Handles the INTERACTION_CREATE gateway event
 * @param client The Typicord client instance
 * @param data The INTERACTION_CREATE event payload
 */
export const handleInteractionCreate: DispatchHandler<RawInteractionData> = (
  client,
  data
) => {
  debug.log(DebugNamespace.INTERACTION, "Processing INTERACTION_CREATE event", {
    type: data.type,
    id: data.id,
    user: data.user?.id || data.member?.user?.id,
  });

  // Emit the INTERACTION_CREATE event to user listeners (Client will wrap this in InteractionCreateEventData)
  client.emitRaw("INTERACTION_CREATE", data);
};

// Register this handler with the dispatch registry
dispatchHandlerRegistry.registerDispatchHandler(
  "INTERACTION_CREATE",
  handleInteractionCreate
);
