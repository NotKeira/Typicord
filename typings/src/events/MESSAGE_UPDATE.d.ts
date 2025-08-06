/**
 * MESSAGE_UPDATE Event
 *
 * Emitted when a message is updated (edited).
 */
import type { Message } from "@/types/gateway/structures/Message";
export declare class MessageUpdateData {
    data: Partial<Message>;
    constructor(data: Partial<Message>);
    /**
     * The updated message data (partial)
     */
    get message(): Partial<Message>;
    /**
     * Message ID
     */
    get id(): string | undefined;
    /**
     * Channel ID where the message was updated
     */
    get channelId(): string | undefined;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
    /**
     * Updated content (if changed)
     */
    get content(): string | undefined;
    /**
     * Updated embeds (if changed)
     */
    get embeds(): import("../types/gateway/structures/Embed").Embed[] | undefined;
}
//# sourceMappingURL=MESSAGE_UPDATE.d.ts.map