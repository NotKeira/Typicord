/**
 * GUILD_MEMBER_REMOVE Event
 *
 * Emitted when a member leaves a guild (kicked, banned, or left voluntarily).
 */

import type { User } from "@/types/structures/user";

export interface GuildMemberRemoveData {
  /** The guild ID where the member was removed */
  guild_id: string;
  /** The user that was removed */
  user: User;
}

export class GuildMemberRemoveEventData {
  constructor(public data: GuildMemberRemoveData) {}

  /**
   * The user that was removed from the guild
   */
  get user() {
    return this.data.user;
  }

  /**
   * The guild ID where the member was removed
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user's ID
   */
  get userId() {
    return this.data.user.id;
  }

  /**
   * The user's username
   */
  get username() {
    return this.data.user.username;
  }

  /**
   * The user's discriminator
   */
  get discriminator() {
    return this.data.user.discriminator;
  }

  /**
   * The user's display name
   */
  get displayName() {
    return this.data.user.global_name || this.data.user.username;
  }

  /**
   * The user's avatar hash
   */
  get avatar() {
    return this.data.user.avatar;
  }

  /**
   * Whether the user is a bot
   */
  get isBot() {
    return this.data.user.bot || false;
  }

  /**
   * The user's tag (username#discriminator)
   */
  get tag() {
    return `${this.data.user.username}#${this.data.user.discriminator}`;
  }
}
