import type { Client } from "@/client/Client";
/**
 * Discord role structure data from the API
 */
export interface RoleData {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string | null;
    unicode_emoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: {
        bot_id?: string;
        integration_id?: string;
        premium_subscriber?: null;
        subscription_listing_id?: string;
        available_for_purchase?: null;
        guild_connections?: null;
    };
}
/**
 * Represents a Discord role with methods for management
 */
export declare class Role {
    readonly id: string;
    name: string;
    color: number;
    hoist: boolean;
    icon?: string | null;
    unicodeEmoji?: string | null;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
    tags?: RoleData["tags"];
    guildId: string;
    raw: RoleData;
    private readonly client;
    constructor(client: Client, data: RoleData, guildId: string);
    /**
     * Edits this role
     */
    edit(options: {
        name?: string;
        permissions?: string;
        color?: number;
        hoist?: boolean;
        icon?: string | null;
        unicode_emoji?: string | null;
        mentionable?: boolean;
    }, reason?: string): Promise<Role>;
    /**
     * Deletes this role
     */
    delete(reason?: string): Promise<void>;
    /**
     * Sets the position of this role
     */
    setPosition(position: number, reason?: string): Promise<Role[]>;
    /**
     * Gets the color as a hex string
     */
    get hexColor(): string;
    /**
     * Gets the role's icon URL if it has one
     */
    iconURL(options?: {
        size?: number;
        format?: "png" | "jpg" | "webp";
    }): string | null;
    /**
     * Whether this role is the @everyone role
     */
    get isEveryone(): boolean;
    /**
     * Whether this role is managed by an integration
     */
    get isManaged(): boolean;
    /**
     * Whether this role is hoisted (displayed separately)
     */
    get isHoisted(): boolean;
    /**
     * Whether this role can be mentioned
     */
    get isMentionable(): boolean;
    /**
     * The mention string for this role
     */
    toString(): string;
    /**
     * Gets members who have this role
     */
    fetchMembers(): Promise<any[]>;
}
//# sourceMappingURL=Role.d.ts.map