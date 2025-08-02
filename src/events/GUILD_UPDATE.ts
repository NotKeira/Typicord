/**
 * GUILD_UPDATE Event
 *
 * Emitted when a guild is updated.
 */

import type { Guild } from "@/types/structures/guild";

export class GuildUpdateEventData {
  constructor(public data: Guild) {}

  /**
   * The updated guild data
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
}
