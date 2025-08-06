/**
 * MESSAGE_REACTION_ADD Event
 *
 * Emitted when a reaction is added to a message.
 */
import type { MessageReactionEvent } from "@/types/gateway/events";
export declare class MessageReactionAddData {
    data: MessageReactionEvent;
    constructor(data: MessageReactionEvent);
    /**
     * User ID who added the reaction
     */
    get userId(): string;
    /**
     * Channel ID where the reaction was added
     */
    get channelId(): string;
    /**
     * Message ID that was reacted to
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
     * The emoji used for the reaction
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
//# sourceMappingURL=MESSAGE_REACTION_ADD.d.ts.map