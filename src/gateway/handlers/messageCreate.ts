/**
 * Handler for MESSAGE_CREATE gateway event
 *
 * The MESSAGE_CREATE event is sent when a new message is created in a channel
 * that the bot has access to. This handler wraps the raw payload in a Message class.
 */

import { debug, DebugNamespace } from "@/debug";
import {
  dispatchHandlerRegistry,
  type DispatchHandler,
} from "../DispatchHandlerRegistry";
import type { Message } from "@/types/gateway/structures/Message";

/**
 * Handles the MESSAGE_CREATE gateway event
 * @param client The Typicord client instance
 * @param data The MESSAGE_CREATE event payload
 */
export const handleMessageCreate: DispatchHandler<Message> = (client, data) => {
  debug.log(DebugNamespace.EVENTS, "Processing MESSAGE_CREATE event", {
    messageId: data.id,
    channelId: data.channel_id,
    authorId: data.author?.id,
  });

  // Emit the MESSAGE_CREATE event to user listeners (Client will wrap this in MessageCreateEventData)
  client.emitRaw("MESSAGE_CREATE", data);
};

// Register this handler with the dispatch registry
dispatchHandlerRegistry.registerDispatchHandler(
  "MESSAGE_CREATE",
  handleMessageCreate
);
