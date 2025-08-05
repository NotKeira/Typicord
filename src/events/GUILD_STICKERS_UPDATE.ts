/**
 * GUILD_STICKERS_UPDATE Event
 *
 * Sent when a guild's stickers have been updated.
 */

import type { Sticker } from "@/structures/Guild";

export interface GuildStickersUpdateData {
  /** ID of the guild */
  guild_id: string;
  /** Array of stickers */
  stickers: Sticker[];
}

export class GuildStickersUpdateEventData {
  constructor(public data: GuildStickersUpdateData) {}

  /**
   * The guild ID where stickers were updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Array of stickers in the guild
   */
  get stickers() {
    return this.data.stickers;
  }

  /**
   * Number of stickers in the guild
   */
  get stickerCount() {
    return this.data.stickers.length;
  }

  /**
   * Get available stickers
   */
  get availableStickers() {
    return this.data.stickers.filter(sticker => sticker.available !== false);
  }
}
