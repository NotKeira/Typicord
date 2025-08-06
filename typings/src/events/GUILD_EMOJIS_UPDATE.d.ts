/**
 * GUILD_EMOJIS_UPDATE Event
 *
 * Sent when a guild's emojis have been updated.
 */
import type { Emoji } from "@/types/structures/emoji";
export interface GuildEmojisUpdateEventData {
    /** ID of the guild */
    guild_id: string;
    /** Array of emojis */
    emojis: Emoji[];
}
export declare class GuildEmojisUpdateData {
    data: GuildEmojisUpdateEventData;
    constructor(data: GuildEmojisUpdateEventData);
    /**
     * The guild ID where emojis were updated
     */
    get guildId(): string;
    /**
     * Array of emojis in the guild
     */
    get emojis(): Emoji[];
    /**
     * Number of emojis in the guild
     */
    get emojiCount(): number;
    /**
     * Get custom (non-unicode) emojis
     */
    get customEmojis(): Emoji[];
    /**
     * Get animated emojis
     */
    get animatedEmojis(): Emoji[];
}
//# sourceMappingURL=GUILD_EMOJIS_UPDATE.d.ts.map