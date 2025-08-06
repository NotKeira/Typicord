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
export declare class GuildRoleRemoveEventData {
    data: GuildRoleRemoveData;
    constructor(data: GuildRoleRemoveData);
    /**
     * The guild ID where the role was removed
     */
    get guildId(): string;
    /**
     * The ID of the role that was removed
     */
    get roleId(): string;
    /**
     * The role mention string (for the removed role)
     */
    get mention(): string;
}
//# sourceMappingURL=GUILD_ROLE_REMOVE.d.ts.map