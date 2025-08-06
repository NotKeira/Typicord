/**
 * MESSAGE_REACTION_REMOVE Event
 *
 * Emitted when a reaction is removed from a message.
 */
import type { MessageReactionEvent } from "@/types/gateway/events";
export declare class MessageReactionRemoveData {
    data: MessageReactionEvent;
    constructor(data: MessageReactionEvent);
    /**
     * User ID who removed the reaction
     */
    get userId(): string;
    /**
     * Channel ID where the reaction was removed
     */
    get channelId(): string;
    /**
     * Message ID that the reaction was removed from
     */
    get messageId(): string;
    /**
     * Guild ID (if in a guild)
     */
    get guildId(): string | undefined;
    /**
     * Guild member (if in a guild)
     */
    get member(): import("../types/structures/guild").GuildMember | undefined;
    /**
     * The emoji that was removed
     */
    get emoji(): {
        id: string | null;
        name: string | null;
        animated?: boolean;
    };
    /**
     * Whether the emoji is custom
     */
    get isCustomEmoji(): boolean;
    /**
     * Whether the emoji is animated
     */
    get isAnimated(): boolean;
}
//# sourceMappingURL=MESSAGE_REACTION_REMOVE.d.ts.map