/**
 * THREAD_MEMBER_UPDATE Event
 *
 * Sent when the thread member object for the current user is updated.
 */
export interface ThreadMemberUpdateEventData {
    /** The id of the thread */
    id?: string;
    /** The id of the user */
    user_id?: string;
    /** The time the current user last joined the thread */
    join_timestamp: string;
    /** Any user-thread settings, currently only used for notifications */
    flags: number;
    /** Additional information about the user */
    member?: {
        /** The user's id */
        id?: string;
        /** The user's username, not unique across the platform */
        username?: string;
        /** The user's 4-digit discord-tag */
        discriminator?: string;
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
    };
    /** The guild id */
    guild_id: string;
}
export declare class ThreadMemberUpdateData {
    data: ThreadMemberUpdateEventData;
    constructor(data: ThreadMemberUpdateEventData);
    /**
     * The thread ID
     */
    get threadId(): string | undefined;
    /**
     * The user ID
     */
    get userId(): string | undefined;
    /**
     * When the user joined the thread
     */
    get joinTimestamp(): Date;
    /**
     * Thread member flags
     */
    get flags(): number;
    /**
     * Additional member information
     */
    get member(): {
        /** The user's id */
        id?: string;
        /** The user's username, not unique across the platform */
        username?: string;
        /** The user's 4-digit discord-tag */
        discriminator?: string;
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
    } | undefined;
    /**
     * The guild ID
     */
    get guildId(): string;
    /**
     * Whether notifications are enabled for this thread
     */
    get hasNotifications(): boolean;
    /**
     * Whether notifications are disabled for this thread
     */
    get hasNotificationsDisabled(): boolean;
}
//# sourceMappingURL=THREAD_MEMBER_UPDATE.d.ts.map