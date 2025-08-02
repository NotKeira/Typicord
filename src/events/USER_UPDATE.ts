/**
 * USER_UPDATE Event
 *
 * Emitted when the bot user's information is updated.
 */

import type { User } from "@/types/structures/user";

export class UserUpdateEventData {
  constructor(public data: User) {}

  /**
   * The updated user data
   */
  get user() {
    return this.data;
  }

  /**
   * User ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Username
   */
  get username() {
    return this.data.username;
  }

  /**
   * Discriminator
   */
  get discriminator() {
    return this.data.discriminator;
  }

  /**
   * Avatar hash
   */
  get avatar() {
    return this.data.avatar;
  }

  /**
   * Whether the user is a bot
   */
  get bot() {
    return this.data.bot;
  }

  /**
   * User flags
   */
  get flags() {
    return this.data.flags;
  }

  /**
   * Premium type
   */
  get premiumType() {
    return this.data.premium_type;
  }
}
