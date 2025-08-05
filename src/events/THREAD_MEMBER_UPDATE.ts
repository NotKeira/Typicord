/**
 * THREAD_MEMBER_UPDATE Event
 *
 * Sent when the thread member object for the current user is updated.
 */

export interface ThreadMemberUpdateData {
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

export class ThreadMemberUpdateEventData {
  constructor(public data: ThreadMemberUpdateData) {}

  /**
   * The thread ID
   */
  get threadId() {
    return this.data.id;
  }

  /**
   * The user ID
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * When the user joined the thread
   */
  get joinTimestamp() {
    return new Date(this.data.join_timestamp);
  }

  /**
   * Thread member flags
   */
  get flags() {
    return this.data.flags;
  }

  /**
   * Additional member information
   */
  get member() {
    return this.data.member;
  }

  /**
   * The guild ID
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Whether notifications are enabled for this thread
   */
  get hasNotifications() {
    return (this.data.flags & 1) === 0; // If flag is not set, notifications are enabled
  }

  /**
   * Whether notifications are disabled for this thread
   */
  get hasNotificationsDisabled() {
    return (this.data.flags & 1) === 1; // NOTIFICATIONS_DISABLED flag
  }
}
