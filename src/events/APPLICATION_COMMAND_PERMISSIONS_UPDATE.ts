/**
 * APPLICATION_COMMAND_PERMISSIONS_UPDATE Event
 *
 * Sent when an application command's permissions are updated.
 */

export interface ApplicationCommandPermission {
  /** ID of the role, user, or channel */
  id: string;
  /** Role (1), user (2), or channel (3) */
  type: number;
  /** Whether the permission allows or denies access */
  permission: boolean;
}

export interface ApplicationCommandPermissionsUpdateEventData {
  /** ID of the command or the application ID */
  id: string;
  /** ID of the application the command belongs to */
  application_id: string;
  /** ID of the guild */
  guild_id: string;
  /** Permissions for the command in the guild, max of 100 */
  permissions: ApplicationCommandPermission[];
}

export class ApplicationCommandPermissionsUpdateData {
  constructor(public data: ApplicationCommandPermissionsUpdateEventData) {}

  /**
   * ID of the command or application
   */
  get id() {
    return this.data.id;
  }

  /**
   * The application ID
   */
  get applicationId() {
    return this.data.application_id;
  }

  /**
   * The guild ID where permissions were updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Array of permissions for the command
   */
  get permissions() {
    return this.data.permissions;
  }

  /**
   * Get permissions that allow access
   */
  get allowedPermissions() {
    return this.data.permissions.filter(p => p.permission === true);
  }

  /**
   * Get permissions that deny access
   */
  get deniedPermissions() {
    return this.data.permissions.filter(p => p.permission === false);
  }

  /**
   * Get role permissions
   */
  get rolePermissions() {
    return this.data.permissions.filter(p => p.type === 1);
  }

  /**
   * Get user permissions
   */
  get userPermissions() {
    return this.data.permissions.filter(p => p.type === 2);
  }

  /**
   * Get channel permissions
   */
  get channelPermissions() {
    return this.data.permissions.filter(p => p.type === 3);
  }
}
