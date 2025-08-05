/**
 * GUILD_EMOJIS_UPDATE Event
 *
 * Sent when a guild's emojis have been updated.
 */

import type { Emoji } from "@/types/structures/emoji";

export interface GuildEmojisUpdateData {
  /** ID of the guild */
  guild_id: string;
  /** Array of emojis */
  emojis: Emoji[];
}

export class GuildEmojisUpdateEventData {
  constructor(public data: GuildEmojisUpdateData) {}

  /**
   * The guild ID where emojis were updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Array of emojis in the guild
   */
  get emojis() {
    return this.data.emojis;
  }

  /**
   * Number of emojis in the guild
   */
  get emojiCount() {
    return this.data.emojis.length;
  }

  /**
   * Get custom (non-unicode) emojis
   */
  get customEmojis() {
    return this.data.emojis.filter(emoji => emoji.id !== null);
  }

  /**
   * Get animated emojis
   */
  get animatedEmojis() {
    return this.data.emojis.filter(emoji => emoji.animated === true);
  }
}
