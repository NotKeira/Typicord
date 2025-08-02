/**
 * Handler for RESUMED gateway event
 *
 * The RESUMED event is sent when the client has successfully resumed a previous session.
 */

import { debug, DebugNamespace } from "@/debug";
import {
  dispatchHandlerRegistry,
  type DispatchHandler,
} from "../DispatchHandlerRegistry";

/**
 * Handles the RESUMED gateway event
 * @param client The Typicord client instance
 * @param data The RESUMED event payload (void)
 */
export const handleResumed: DispatchHandler<void> = (client, _data) => {
  debug.info(DebugNamespace.GATEWAY, "Session resumed successfully");

  // Notify reconnection manager of successful connection
  (client as any).gateway.reconnectionManager.onConnectionSuccess();

  // Emit the RESUMED event to user listeners (Client will wrap this in ResumedEventData)
  (client as any).emitRaw("RESUMED", undefined);
};

// Register this handler with the dispatch registry
dispatchHandlerRegistry.registerDispatchHandler("RESUMED", handleResumed);
