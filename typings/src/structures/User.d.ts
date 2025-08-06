import type { User as RawUser } from "../types/structures/user";
import type { RESTClient } from "@/client/RESTClient";
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
export declare class User {
    data: RawUser;
    private readonly _client?;
    constructor(data: RawUser, client?: RESTClient);
    get name(): string;
    get discriminator(): string;
    get id(): string;
    get tag(): string;
    get mention(): string;
    get isSystem(): boolean;
    get isVerified(): boolean;
    get isMFAEnabled(): boolean;
    get isBot(): boolean;
    get avatarURL(): string | null;
    /**
     * Get the user's avatar decoration URL
     */
    get avatarDecorationURL(): string | null;
    /**
     * Get the user's banner URL
     */
    get bannerURL(): string | null;
    /**
     * Get the user's display avatar URL (avatar or default)
     */
    get displayAvatarURL(): string;
    /**
     * Create a DM channel with this user
     */
    createDM(): Promise<any>;
    /**
     * Delete DM channel with this user
     */
    deleteDM(): Promise<void>;
    /**
     * Send a message to this user
     */
    send(content: string, options?: any): Promise<any>;
    /**
     * Fetch fresh user data from Discord
     */
    fetch(): Promise<User>;
    /**
     * Fetch user flags
     */
    fetchFlags(): Promise<number>;
    /**
     * Check if this user equals another user
     */
    equals(other: User): boolean;
    /**
     * Convert to JSON representation
     */
    toJSON(): RawUser;
    /**
     * String representation
     */
    toString(): string;
    /**
     * Value representation
     */
    valueOf(): string;
}
//# sourceMappingURL=User.d.ts.map