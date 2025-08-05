/**
 * GUILD_MEMBER_ADD Event
 *
 * Emitted when a new member joins a guild.
 */

import type { GuildMember } from "@/structures/Guild";

export interface GuildMemberAddData extends GuildMember {
  /** The guild ID where the member joined */
  guild_id: string;
}

export class GuildMemberAddEventData {
  constructor(public data: GuildMemberAddData) {}

  /**
   * The guild member data
   */
  get member() {
    return this.data;
  }

  /**
   * The user object for the member
   */
  get user() {
    return this.data.user;
  }

  /**
   * The guild ID where the member joined
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The member's nickname in the guild
   */
  get nick() {
    return this.data.nick;
  }

  /**
   * The member's guild avatar hash
   */
  get avatar() {
    return this.data.avatar;
  }

  /**
   * Array of role IDs the member has
   */
  get roles() {
    return this.data.roles;
  }

  /**
   * When the user joined the guild
   */
  get joinedAt() {
    return new Date(this.data.joined_at);
  }

  /**
   * When the user started boosting the guild (if applicable)
   */
  get premiumSince() {
    return this.data.premium_since ? new Date(this.data.premium_since) : null;
  }

  /**
   * Whether the user is deafened in voice channels
   */
  get deaf() {
    return this.data.deaf;
  }

  /**
   * Whether the user is muted in voice channels
   */
  get mute() {
    return this.data.mute;
  }

  /**
   * Guild member flags represented as a bit set
   */
  get flags() {
    return this.data.flags;
  }

  /**
   * Whether the user has passed the guild's Membership Screening requirements
   */
  get pending() {
    return this.data.pending;
  }

  /**
   * The member's display name (nickname or username)
   */
  get displayName() {
    return this.data.nick || this.data.user?.username || "Unknown User";
  }
}
