/**
 * GUILD_BAN_REMOVE Event
 *
 * Sent when a user is unbanned from a guild.
 */

import type { User } from "@/types/structures/user";

export interface GuildBanRemoveEventData {
  /** ID of the guild */
  guild_id: string;
  /** User who was unbanned */
  user: User;
}

export class GuildBanRemoveData {
  constructor(public data: GuildBanRemoveEventData) {}

  /**
   * The guild ID where the unban occurred
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user who was unbanned
   */
  get user() {
    return this.data.user;
  }

  /**
   * The unbanned user's ID
   */
  get userId() {
    return this.data.user.id;
  }

  /**
   * The unbanned user's username
   */
  get username() {
    return this.data.user.username;
  }

  /**
   * The unbanned user's discriminator
   */
  get discriminator() {
    return this.data.user.discriminator;
  }

  /**
   * The unbanned user's display name
   */
  get displayName() {
    return this.data.user.global_name || this.data.user.username;
  }

  /**
   * Whether the unbanned user is a bot
   */
  get isBot() {
    return this.data.user.bot || false;
  }

  /**
   * The unbanned user's tag (username#discriminator)
   */
  get tag() {
    return `${this.data.user.username}#${this.data.user.discriminator}`;
  }
}
