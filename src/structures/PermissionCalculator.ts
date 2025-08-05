/**
 * Permission Utilities for Discord API
 * Handles permission calculations and checks
 */

export const PermissionBits = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_EMOJIS_AND_STICKERS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  USE_EMBEDDED_ACTIVITIES: 1n << 39n,
  MODERATE_MEMBERS: 1n << 40n,
  VIEW_CREATOR_MONETIZATION_ANALYTICS: 1n << 41n,
  USE_SOUNDBOARD: 1n << 42n,
  USE_EXTERNAL_SOUNDS: 1n << 45n,
  SEND_VOICE_MESSAGES: 1n << 46n,
} as const;

export type PermissionBit =
  (typeof PermissionBits)[keyof typeof PermissionBits];

export class PermissionCalculator {
  /**
   * Check if a permission bitfield includes a specific permission
   */
  static has(permissions: string | bigint, permission: PermissionBit): boolean {
    const perms =
      typeof permissions === "string" ? BigInt(permissions) : permissions;
    return (perms & permission) === permission;
  }

  /**
   * Check if a permission bitfield includes any of the specified permissions
   */
  static hasAny(
    permissions: string | bigint,
    ...permissionList: PermissionBit[]
  ): boolean {
    const perms =
      typeof permissions === "string" ? BigInt(permissions) : permissions;
    return permissionList.some(
      permission => (perms & permission) === permission
    );
  }

  /**
   * Check if a permission bitfield includes all of the specified permissions
   */
  static hasAll(
    permissions: string | bigint,
    ...permissionList: PermissionBit[]
  ): boolean {
    const perms =
      typeof permissions === "string" ? BigInt(permissions) : permissions;
    return permissionList.every(
      permission => (perms & permission) === permission
    );
  }

  /**
   * Add permissions to a bitfield
   */
  static add(
    permissions: string | bigint,
    ...permissionList: PermissionBit[]
  ): bigint {
    let perms =
      typeof permissions === "string" ? BigInt(permissions) : permissions;
    for (const permission of permissionList) {
      perms |= permission;
    }
    return perms;
  }

  /**
   * Remove permissions from a bitfield
   */
  static remove(
    permissions: string | bigint,
    ...permissionList: PermissionBit[]
  ): bigint {
    let perms =
      typeof permissions === "string" ? BigInt(permissions) : permissions;
    for (const permission of permissionList) {
      perms &= ~permission;
    }
    return perms;
  }

  /**
   * Get all permissions in a readable array
   */
  static toArray(permissions: string | bigint): string[] {
    const perms =
      typeof permissions === "string" ? BigInt(permissions) : permissions;
    const result: string[] = [];

    for (const [name, bit] of Object.entries(PermissionBits)) {
      if (typeof bit === "bigint" && (perms & bit) === bit) {
        result.push(name);
      }
    }

    return result;
  }

  /**
   * Create permissions bitfield from array of permission names
   */
  static fromArray(permissionNames: string[]): bigint {
    let permissions = 0n;

    for (const name of permissionNames) {
      const bit = PermissionBits[name as keyof typeof PermissionBits];
      if (bit) {
        permissions |= bit;
      }
    }

    return permissions;
  }

  /**
   * Calculate effective permissions for a member in a channel
   */
  static calculateChannelPermissions(
    memberPermissions: string | bigint,
    channelOverwrites: Array<{
      id: string;
      type: number;
      allow: string;
      deny: string;
    }>,
    memberRoleIds: string[],
    memberId: string
  ): bigint {
    let permissions =
      typeof memberPermissions === "string"
        ? BigInt(memberPermissions)
        : memberPermissions;

    // If user has administrator, they have all permissions
    if (this.has(permissions, PermissionBits.ADMINISTRATOR)) {
      return Object.values(PermissionBits).reduce((acc, bit) => {
        if (typeof bit === "bigint") {
          return acc | bit;
        }
        return acc;
      }, 0n);
    }

    // Apply role overwrites
    const roleOverwrites = channelOverwrites.filter(
      overwrite => overwrite.type === 0 && memberRoleIds.includes(overwrite.id)
    );

    for (const overwrite of roleOverwrites) {
      permissions &= ~BigInt(overwrite.deny);
      permissions |= BigInt(overwrite.allow);
    }

    // Apply member-specific overwrites
    const memberOverwrite = channelOverwrites.find(
      overwrite => overwrite.type === 1 && overwrite.id === memberId
    );

    if (memberOverwrite) {
      permissions &= ~BigInt(memberOverwrite.deny);
      permissions |= BigInt(memberOverwrite.allow);
    }

    return permissions;
  }

  /**
   * Check if permissions are sufficient for common actions
   */
  static canSendMessages(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.SEND_MESSAGES
    );
  }

  static canEmbedLinks(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.SEND_MESSAGES,
      PermissionBits.EMBED_LINKS
    );
  }

  static canAttachFiles(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.SEND_MESSAGES,
      PermissionBits.ATTACH_FILES
    );
  }

  static canManageMessages(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.MANAGE_MESSAGES
    );
  }

  static canManageChannels(permissions: string | bigint): boolean {
    return this.has(permissions, PermissionBits.MANAGE_CHANNELS);
  }

  static canKickMembers(permissions: string | bigint): boolean {
    return this.has(permissions, PermissionBits.KICK_MEMBERS);
  }

  static canBanMembers(permissions: string | bigint): boolean {
    return this.has(permissions, PermissionBits.BAN_MEMBERS);
  }

  static canManageRoles(permissions: string | bigint): boolean {
    return this.has(permissions, PermissionBits.MANAGE_ROLES);
  }

  static canCreateThreads(permissions: string | bigint): boolean {
    return this.hasAny(
      permissions,
      PermissionBits.CREATE_PUBLIC_THREADS,
      PermissionBits.CREATE_PRIVATE_THREADS
    );
  }

  static canManageThreads(permissions: string | bigint): boolean {
    return this.has(permissions, PermissionBits.MANAGE_THREADS);
  }

  static canUseSlashCommands(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.USE_APPLICATION_COMMANDS
    );
  }

  static canConnectToVoice(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.CONNECT
    );
  }

  static canSpeakInVoice(permissions: string | bigint): boolean {
    return this.hasAll(
      permissions,
      PermissionBits.VIEW_CHANNEL,
      PermissionBits.CONNECT,
      PermissionBits.SPEAK
    );
  }

  /**
   * Convert permissions to string for API usage
   */
  static toString(permissions: bigint): string {
    return permissions.toString();
  }
}
