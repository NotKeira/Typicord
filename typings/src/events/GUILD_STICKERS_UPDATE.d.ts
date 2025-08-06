/**
 * GUILD_STICKERS_UPDATE Event
 *
 * Sent when a guild's stickers have been updated.
 */
import type { Sticker } from "@/structures/Guild";
export interface GuildStickersUpdateEventData {
    /** ID of the guild */
    guild_id: string;
    /** Array of stickers */
    stickers: Sticker[];
}
export declare class GuildStickersUpdateData {
    data: GuildStickersUpdateEventData;
    constructor(data: GuildStickersUpdateEventData);
    /**
     * The guild ID where stickers were updated
     */
    get guildId(): string;
    /**
     * Array of stickers in the guild
     */
    get stickers(): Sticker[];
    /**
     * Number of stickers in the guild
     */
    get stickerCount(): number;
    /**
     * Get available stickers
     */
    get availableStickers(): Sticker[];
}
//# sourceMappingURL=GUILD_STICKERS_UPDATE.d.ts.map