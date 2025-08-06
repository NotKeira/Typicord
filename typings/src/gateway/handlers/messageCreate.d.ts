/**
 * Handler for MESSAGE_CREATE gateway event
 *
 * The MESSAGE_CREATE event is sent when a new message is created in a channel
 * that the bot has access to. This handler wraps the raw payload in a Message class.
 */
import { type DispatchHandler } from "../DispatchHandlerRegistry";
import type { Message } from "@/types/gateway/structures/Message";
/**
 * Handles the MESSAGE_CREATE gateway event
 * @param client The Typicord client instance
 * @param data The MESSAGE_CREATE event payload
 */
export declare const handleMessageCreate: DispatchHandler<Message>;
//# sourceMappingURL=messageCreate.d.ts.map