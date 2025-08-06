/**
 * GUILD_ROLE_DELETE Event
 *
 * Emitted when a role is deleted from a guild.
 */
export interface GuildRoleDeleteEventData {
    /** The guild ID where the role was deleted */
    guild_id: string;
    /** The ID of the role that was deleted */
    role_id: string;
}
export declare class GuildRoleDeleteData {
    data: GuildRoleDeleteEventData;
    constructor(data: GuildRoleDeleteEventData);
    /**
     * The guild ID where the role was deleted
     */
    get guildId(): string;
    /**
     * The ID of the role that was deleted
     */
    get roleId(): string;
    /**
     * The role mention string (for the deleted role)
     */
    get mention(): string;
}
//# sourceMappingURL=GUILD_ROLE_DELETE.d.ts.map