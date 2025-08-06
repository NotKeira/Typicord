/**
 * Handler for INTERACTION_CREATE gateway event
 *
 * The INTERACTION_CREATE event is sent when a user interacts with the bot
 * through slash commands, buttons, select menus, etc.
 */
import { type DispatchHandler } from "../DispatchHandlerRegistry";
import type { RawInteractionData } from "@/types/gateway/interaction";
/**
 * Handles the INTERACTION_CREATE gateway event
 * @param client The Typicord client instance
 * @param data The INTERACTION_CREATE event payload
 */
export declare const handleInteractionCreate: DispatchHandler<RawInteractionData>;
//# sourceMappingURL=interactionCreate.d.ts.map