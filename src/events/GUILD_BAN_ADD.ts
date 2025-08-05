/**
 * GUILD_BAN_ADD Event
 *
 * Sent when a user is banned from a guild.
 */

import type { User } from "@/types/structures/user";

export interface GuildBanAddData {
  /** ID of the guild */
  guild_id: string;
  /** User who was banned */
  user: User;
}

export class GuildBanAddEventData {
  constructor(public data: GuildBanAddData) {}

  /**
   * The guild ID where the ban occurred
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user who was banned
   */
  get user() {
    return this.data.user;
  }

  /**
   * The banned user's ID
   */
  get userId() {
    return this.data.user.id;
  }

  /**
   * The banned user's username
   */
  get username() {
    return this.data.user.username;
  }

  /**
   * The banned user's discriminator
   */
  get discriminator() {
    return this.data.user.discriminator;
  }

  /**
   * The banned user's display name
   */
  get displayName() {
    return this.data.user.global_name || this.data.user.username;
  }

  /**
   * Whether the banned user is a bot
   */
  get isBot() {
    return this.data.user.bot || false;
  }

  /**
   * The banned user's tag (username#discriminator)
   */
  get tag() {
    return `${this.data.user.username}#${this.data.user.discriminator}`;
  }
}
