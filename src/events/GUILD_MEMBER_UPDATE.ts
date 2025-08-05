/**
 * GUILD_MEMBER_UPDATE Event
 *
 * Emitted when a guild member is updated (e.g., nickname changed, roles changed).
 */

import type { GuildMember } from "@/structures/Guild";

export interface GuildMemberUpdateData extends GuildMember {
  /** The guild ID where the member was updated */
  guild_id: string;
}

export class GuildMemberUpdateEventData {
  constructor(public data: GuildMemberUpdateData) {}

  /**
   * The updated guild member data
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
   * The guild ID where the member was updated
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
   * When the user's timeout will expire (if applicable)
   */
  get communicationDisabledUntil() {
    return this.data.communication_disabled_until
      ? new Date(this.data.communication_disabled_until)
      : null;
  }

  /**
   * The member's display name (nickname or username)
   */
  get displayName() {
    return this.data.nick || this.data.user?.username || "Unknown User";
  }
}
