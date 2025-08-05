/**
 * GUILD_ROLE_REMOVE Event
 *
 * Emitted when a role is removed from a guild.
 * Note: This is functionally the same as GUILD_ROLE_DELETE
 */

export interface GuildRoleRemoveData {
  /** The guild ID where the role was removed */
  guild_id: string;
  /** The ID of the role that was removed */
  role_id: string;
}

export class GuildRoleRemoveEventData {
  constructor(public data: GuildRoleRemoveData) {}

  /**
   * The guild ID where the role was removed
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The ID of the role that was removed
   */
  get roleId() {
    return this.data.role_id;
  }

  /**
   * The role mention string (for the removed role)
   */
  get mention() {
    return `<@&${this.data.role_id}>`;
  }
}
