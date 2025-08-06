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
export declare class ApplicationCommandPermissionsUpdateData {
    data: ApplicationCommandPermissionsUpdateEventData;
    constructor(data: ApplicationCommandPermissionsUpdateEventData);
    /**
     * ID of the command or application
     */
    get id(): string;
    /**
     * The application ID
     */
    get applicationId(): string;
    /**
     * The guild ID where permissions were updated
     */
    get guildId(): string;
    /**
     * Array of permissions for the command
     */
    get permissions(): ApplicationCommandPermission[];
    /**
     * Get permissions that allow access
     */
    get allowedPermissions(): ApplicationCommandPermission[];
    /**
     * Get permissions that deny access
     */
    get deniedPermissions(): ApplicationCommandPermission[];
    /**
     * Get role permissions
     */
    get rolePermissions(): ApplicationCommandPermission[];
    /**
     * Get user permissions
     */
    get userPermissions(): ApplicationCommandPermission[];
    /**
     * Get channel permissions
     */
    get channelPermissions(): ApplicationCommandPermission[];
}
//# sourceMappingURL=APPLICATION_COMMAND_PERMISSIONS_UPDATE.d.ts.map