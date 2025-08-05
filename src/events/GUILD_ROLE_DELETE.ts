/**
 * GUILD_ROLE_DELETE Event
 *
 * Emitted when a role is deleted from a guild.
 */

export interface GuildRoleDeleteData {
  /** The guild ID where the role was deleted */
  guild_id: string;
  /** The ID of the role that was deleted */
  role_id: string;
}

export class GuildRoleDeleteEventData {
  constructor(public data: GuildRoleDeleteData) {}

  /**
   * The guild ID where the role was deleted
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The ID of the role that was deleted
   */
  get roleId() {
    return this.data.role_id;
  }

  /**
   * The role mention string (for the deleted role)
   */
  get mention() {
    return `<@&${this.data.role_id}>`;
  }
}
