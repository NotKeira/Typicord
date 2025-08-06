/**
 * GUILD_ROLE_UPDATE Event
 *
 * Emitted when a role is updated in a guild.
 */

import type { Role } from "@/types/structures/role";

export interface GuildRoleUpdateEventData {
  /** The guild ID where the role was updated */
  guild_id: string;
  /** The updated role */
  role: Role;
}

export class GuildRoleUpdateData {
  constructor(public data: GuildRoleUpdateEventData) {}

  /**
   * The updated role
   */
  get role() {
    return this.data.role;
  }

  /**
   * The guild ID where the role was updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The role's ID
   */
  get roleId() {
    return this.data.role.id;
  }

  /**
   * The role's name
   */
  get name() {
    return this.data.role.name;
  }

  /**
   * The role's color
   */
  get color() {
    return this.data.role.color;
  }

  /**
   * The role's color as a hex string
   */
  get hexColor() {
    return `#${this.data.role.color.toString(16).padStart(6, "0")}`;
  }

  /**
   * Whether the role is hoisted (displayed separately)
   */
  get hoist() {
    return this.data.role.hoist;
  }

  /**
   * The role's icon hash
   */
  get icon() {
    return this.data.role.icon;
  }

  /**
   * The role's unicode emoji
   */
  get unicodeEmoji() {
    return this.data.role.unicode_emoji;
  }

  /**
   * The role's position in the hierarchy
   */
  get position() {
    return this.data.role.position;
  }

  /**
   * The role's permissions
   */
  get permissions() {
    return this.data.role.permissions;
  }

  /**
   * Whether the role is managed by an integration
   */
  get managed() {
    return this.data.role.managed;
  }

  /**
   * Whether the role is mentionable
   */
  get mentionable() {
    return this.data.role.mentionable;
  }

  /**
   * The role's tags (if any)
   */
  get tags() {
    return this.data.role.tags;
  }

  /**
   * Whether this is the @everyone role
   */
  get isEveryone() {
    return this.data.role.id === this.data.guild_id;
  }

  /**
   * The role mention string
   */
  get mention() {
    return `<@&${this.data.role.id}>`;
  }
}
