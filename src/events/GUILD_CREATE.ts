/**
 * GUILD_CREATE Event
 *
 * Emitted when the bot joins a new guild or when a guild becomes available.
 */

import type { Guild } from "@/types/structures/guild";

export class GuildCreateEventData {
  constructor(public data: Guild) {}

  /**
   * The guild data
   */
  get guild() {
    return this.data;
  }

  /**
   * Guild ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Guild name
   */
  get name() {
    return this.data.name;
  }

  /**
   * Guild owner ID
   */
  get ownerId() {
    return this.data.owner_id;
  }

  /**
   * Guild members array
   */
  get members() {
    return this.data.members;
  }

  /**
   * Guild features
   */
  get features() {
    return this.data.features;
  }

  /**
   * Guild roles
   */
  get roles() {
    return this.data.roles;
  }

  /**
   * Whether the user is the owner of this guild
   */
  get isOwner() {
    return this.data.owner;
  }
}
