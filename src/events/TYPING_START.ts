/**
 * TYPING_START Event
 *
 * Emitted when a user starts typing in a channel.
 */

import type { GuildMember } from "@/types/structures/guild";

export interface TypingStartEventData {
  channel_id: string;
  user_id: string;
  timestamp: number;
  guild_id?: string;
  member?: GuildMember;
}

export class TypingStartData {
  constructor(public data: TypingStartEventData) {}

  /**
   * Channel ID where typing started
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * User ID who started typing
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * Unix timestamp when typing started
   */
  get timestamp() {
    return this.data.timestamp;
  }

  /**
   * Guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Guild member (if in a guild)
   */
  get member() {
    return this.data.member;
  }

  /**
   * Convert timestamp to Date object
   */
  get date() {
    return new Date(this.data.timestamp * 1000);
  }
}
