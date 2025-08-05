/**
 * INTEGRATION_UPDATE Event
 *
 * Sent when an integration is updated.
 */

export interface IntegrationUpdateData {
  /** Integration id */
  id: string;
  /** Integration name */
  name: string;
  /** Integration type (twitch, youtube, discord, or guild_subscription) */
  type: string;
  /** Is this integration enabled */
  enabled: boolean;
  /** Is this integration syncing */
  syncing?: boolean;
  /** ID that this integration uses for "subscribers" */
  role_id?: string;
  /** Whether emoticons should be synced for this integration (twitch only currently) */
  enable_emoticons?: boolean;
  /** The behavior of expiring subscribers */
  expire_behavior?: number;
  /** The grace period (in days) before expiring subscribers */
  expire_grace_period?: number;
  /** User for this integration */
  user?: {
    /** The user's id */
    id: string;
    /** The user's username, not unique across the platform */
    username: string;
    /** The user's 4-digit discord-tag */
    discriminator: string;
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
  /** Integration account information */
  account: {
    /** id of the account */
    id: string;
    /** name of the account */
    name: string;
  };
  /** When this integration was last synced */
  synced_at?: string;
  /** How many subscribers this integration has */
  subscriber_count?: number;
  /** Has this integration been revoked */
  revoked?: boolean;
  /** The guild id */
  guild_id: string;
}

export class IntegrationUpdateEventData {
  constructor(public data: IntegrationUpdateData) {}

  /**
   * The integration ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * The integration name
   */
  get name() {
    return this.data.name;
  }

  /**
   * The integration type
   */
  get type() {
    return this.data.type;
  }

  /**
   * Whether the integration is enabled
   */
  get isEnabled() {
    return this.data.enabled;
  }

  /**
   * Whether the integration is syncing
   */
  get isSyncing() {
    return this.data.syncing;
  }

  /**
   * The role ID for subscribers
   */
  get roleId() {
    return this.data.role_id;
  }

  /**
   * Whether emoticons are enabled
   */
  get hasEmoticonsEnabled() {
    return this.data.enable_emoticons;
  }

  /**
   * The expiration behavior
   */
  get expireBehavior() {
    return this.data.expire_behavior;
  }

  /**
   * The expiration grace period in days
   */
  get expireGracePeriod() {
    return this.data.expire_grace_period;
  }

  /**
   * The user associated with this integration
   */
  get user() {
    return this.data.user;
  }

  /**
   * The account information
   */
  get account() {
    return this.data.account;
  }

  /**
   * When the integration was last synced
   */
  get syncedAt() {
    return this.data.synced_at ? new Date(this.data.synced_at) : null;
  }

  /**
   * Number of subscribers
   */
  get subscriberCount() {
    return this.data.subscriber_count || 0;
  }

  /**
   * Whether the integration is revoked
   */
  get isRevoked() {
    return this.data.revoked;
  }

  /**
   * The guild ID
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Whether this is a Twitch integration
   */
  get isTwitchIntegration() {
    return this.data.type === "twitch";
  }

  /**
   * Whether this is a YouTube integration
   */
  get isYouTubeIntegration() {
    return this.data.type === "youtube";
  }

  /**
   * Whether this is a Discord integration
   */
  get isDiscordIntegration() {
    return this.data.type === "discord";
  }

  /**
   * Whether this is a guild subscription integration
   */
  get isGuildSubscriptionIntegration() {
    return this.data.type === "guild_subscription";
  }
}
