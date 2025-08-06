/**
 * User-related types for Discord API structures
 */
/**
 * Represents a Discord user
 */
export interface User {
    /** The user's ID */
    id: string;
    /** The user's username, not unique across the platform */
    username: string;
    /** The user's 4-digit discord-tag */
    discriminator: string;
    /** The user's display name, if it is set. For bots, this is the application name */
    global_name?: string | null;
    /** The user's avatar hash */
    avatar?: string | null;
    /** Whether the user belongs to an OAuth2 application */
    bot?: boolean;
    /** Whether the user is an Official Discord System user (part of the urgent message system) */
    system?: boolean;
    /** Whether the user has two factor enabled on their account */
    mfa_enabled?: boolean;
    /** The user's banner hash */
    banner?: string | null;
    /** The user's banner color encoded as an integer representation of hexadecimal color code */
    accent_color?: number | null;
    /** The user's chosen language option */
    locale?: string;
    /** Whether the email on this account has been verified */
    verified?: boolean;
    /** The user's email */
    email?: string | null;
    /** The flags on a user's account */
    flags?: number;
    /** The type of Nitro subscription on a user's account */
    premium_type?: number;
    /** The public flags on a user's account */
    public_flags?: number;
    /** The user's avatar decoration hash */
    avatar_decoration?: string | null;
}
/**
 * Represents a partial user object
 */
export interface PartialUser {
    /** The user's ID */
    id: string;
    /** The user's username */
    username?: string;
    /** The user's 4-digit discord-tag */
    discriminator?: string;
    /** The user's display name */
    global_name?: string | null;
    /** The user's avatar hash */
    avatar?: string | null;
}
//# sourceMappingURL=user.d.ts.map