/**
 * Role-related types for Discord API structures
 */
/**
 * Represents a Discord role
 */
export interface Role {
    /** Role ID */
    id: string;
    /** Role name */
    name: string;
    /** Integer representation of hexadecimal color code */
    color: number;
    /** If this role is pinned in the user listing */
    hoist: boolean;
    /** Role icon hash */
    icon?: string | null;
    /** Role unicode emoji */
    unicode_emoji?: string | null;
    /** Position of this role */
    position: number;
    /** Permission bit set */
    permissions: string;
    /** Whether this role is managed by an integration */
    managed: boolean;
    /** Whether this role is mentionable */
    mentionable: boolean;
    /** The tags this role has */
    tags?: RoleTags;
    /** Role flags combined as a bitfield */
    flags: number;
}
/**
 * Represents role tags
 */
export interface RoleTags {
    /** The ID of the bot this role belongs to */
    bot_id?: string;
    /** The ID of the integration this role belongs to */
    integration_id?: string;
    /** Whether this is the guild's Booster role */
    premium_subscriber?: null;
    /** The ID of this role's subscription sku and listing */
    subscription_listing_id?: string;
    /** Whether this role is available for purchase */
    available_for_purchase?: null;
    /** Whether this role is a guild's linked role */
    guild_connections?: null;
}
//# sourceMappingURL=role.d.ts.map