/**
 * Handler for READY gateway event
 *
 * The READY event is sent when the client has successfully connected to Discord
 * and contains initial session data including user information, guilds, and session details.
 */
import { type DispatchHandler } from "../DispatchHandlerRegistry";
import type { ReadyEvent } from "@/types/gateway/events";
/**
 * Handles the READY gateway event
 * @param client The Typicord client instance
 * @param data The READY event payload
 */
export declare const handleReady: DispatchHandler<ReadyEvent>;
//# sourceMappingURL=ready.d.ts.map