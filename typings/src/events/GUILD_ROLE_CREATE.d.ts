/**
 * GUILD_ROLE_CREATE Event
 *
 * Emitted when a role is created in a guild.
 */
import type { Role } from "@/types/structures/role";
export interface GuildRoleCreateEventData {
    /** The guild ID where the role was created */
    guild_id: string;
    /** The role that was created */
    role: Role;
}
export declare class GuildRoleCreateData {
    data: GuildRoleCreateEventData;
    constructor(data: GuildRoleCreateEventData);
    /**
     * The role that was created
     */
    get role(): Role;
    /**
     * The guild ID where the role was created
     */
    get guildId(): string;
    /**
     * The role's ID
     */
    get roleId(): string;
    /**
     * The role's name
     */
    get name(): string;
    /**
     * The role's color
     */
    get color(): number;
    /**
     * The role's color as a hex string
     */
    get hexColor(): string;
    /**
     * Whether the role is hoisted (displayed separately)
     */
    get hoist(): boolean;
    /**
     * The role's icon hash
     */
    get icon(): string | null | undefined;
    /**
     * The role's unicode emoji
     */
    get unicodeEmoji(): string | null | undefined;
    /**
     * The role's position in the hierarchy
     */
    get position(): number;
    /**
     * The role's permissions
     */
    get permissions(): string;
    /**
     * Whether the role is managed by an integration
     */
    get managed(): boolean;
    /**
     * Whether the role is mentionable
     */
    get mentionable(): boolean;
    /**
     * The role's tags (if any)
     */
    get tags(): import("@/types/structures/role").RoleTags | undefined;
    /**
     * Whether this is the @everyone role
     */
    get isEveryone(): boolean;
    /**
     * The role mention string
     */
    get mention(): string;
}
//# sourceMappingURL=GUILD_ROLE_CREATE.d.ts.map