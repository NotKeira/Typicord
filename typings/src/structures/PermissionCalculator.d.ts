/**
 * Permission Utilities for Discord API
 * Handles permission calculations and checks
 */
export declare const PermissionBits: {
    readonly CREATE_INSTANT_INVITE: bigint;
    readonly KICK_MEMBERS: bigint;
    readonly BAN_MEMBERS: bigint;
    readonly ADMINISTRATOR: bigint;
    readonly MANAGE_CHANNELS: bigint;
    readonly MANAGE_GUILD: bigint;
    readonly ADD_REACTIONS: bigint;
    readonly VIEW_AUDIT_LOG: bigint;
    readonly PRIORITY_SPEAKER: bigint;
    readonly STREAM: bigint;
    readonly VIEW_CHANNEL: bigint;
    readonly SEND_MESSAGES: bigint;
    readonly SEND_TTS_MESSAGES: bigint;
    readonly MANAGE_MESSAGES: bigint;
    readonly EMBED_LINKS: bigint;
    readonly ATTACH_FILES: bigint;
    readonly READ_MESSAGE_HISTORY: bigint;
    readonly MENTION_EVERYONE: bigint;
    readonly USE_EXTERNAL_EMOJIS: bigint;
    readonly VIEW_GUILD_INSIGHTS: bigint;
    readonly CONNECT: bigint;
    readonly SPEAK: bigint;
    readonly MUTE_MEMBERS: bigint;
    readonly DEAFEN_MEMBERS: bigint;
    readonly MOVE_MEMBERS: bigint;
    readonly USE_VAD: bigint;
    readonly CHANGE_NICKNAME: bigint;
    readonly MANAGE_NICKNAMES: bigint;
    readonly MANAGE_ROLES: bigint;
    readonly MANAGE_WEBHOOKS: bigint;
    readonly MANAGE_EMOJIS_AND_STICKERS: bigint;
    readonly USE_APPLICATION_COMMANDS: bigint;
    readonly REQUEST_TO_SPEAK: bigint;
    readonly MANAGE_EVENTS: bigint;
    readonly MANAGE_THREADS: bigint;
    readonly CREATE_PUBLIC_THREADS: bigint;
    readonly CREATE_PRIVATE_THREADS: bigint;
    readonly USE_EXTERNAL_STICKERS: bigint;
    readonly SEND_MESSAGES_IN_THREADS: bigint;
    readonly USE_EMBEDDED_ACTIVITIES: bigint;
    readonly MODERATE_MEMBERS: bigint;
    readonly VIEW_CREATOR_MONETIZATION_ANALYTICS: bigint;
    readonly USE_SOUNDBOARD: bigint;
    readonly USE_EXTERNAL_SOUNDS: bigint;
    readonly SEND_VOICE_MESSAGES: bigint;
};
export type PermissionBit = (typeof PermissionBits)[keyof typeof PermissionBits];
export declare class PermissionCalculator {
    /**
     * Check if a permission bitfield includes a specific permission
     */
    static has(permissions: string | bigint, permission: PermissionBit): boolean;
    /**
     * Check if a permission bitfield includes any of the specified permissions
     */
    static hasAny(permissions: string | bigint, ...permissionList: PermissionBit[]): boolean;
    /**
     * Check if a permission bitfield includes all of the specified permissions
     */
    static hasAll(permissions: string | bigint, ...permissionList: PermissionBit[]): boolean;
    /**
     * Add permissions to a bitfield
     */
    static add(permissions: string | bigint, ...permissionList: PermissionBit[]): bigint;
    /**
     * Remove permissions from a bitfield
     */
    static remove(permissions: string | bigint, ...permissionList: PermissionBit[]): bigint;
    /**
     * Get all permissions in a readable array
     */
    static toArray(permissions: string | bigint): string[];
    /**
     * Create permissions bitfield from array of permission names
     */
    static fromArray(permissionNames: string[]): bigint;
    /**
     * Calculate effective permissions for a member in a channel
     */
    static calculateChannelPermissions(memberPermissions: string | bigint, channelOverwrites: Array<{
        id: string;
        type: number;
        allow: string;
        deny: string;
    }>, memberRoleIds: string[], memberId: string): bigint;
    /**
     * Check if permissions are sufficient for common actions
     */
    static canSendMessages(permissions: string | bigint): boolean;
    static canEmbedLinks(permissions: string | bigint): boolean;
    static canAttachFiles(permissions: string | bigint): boolean;
    static canManageMessages(permissions: string | bigint): boolean;
    static canManageChannels(permissions: string | bigint): boolean;
    static canKickMembers(permissions: string | bigint): boolean;
    static canBanMembers(permissions: string | bigint): boolean;
    static canManageRoles(permissions: string | bigint): boolean;
    static canCreateThreads(permissions: string | bigint): boolean;
    static canManageThreads(permissions: string | bigint): boolean;
    static canUseSlashCommands(permissions: string | bigint): boolean;
    static canConnectToVoice(permissions: string | bigint): boolean;
    static canSpeakInVoice(permissions: string | bigint): boolean;
    /**
     * Convert permissions to string for API usage
     */
    static toString(permissions: bigint): string;
}
//# sourceMappingURL=PermissionCalculator.d.ts.map