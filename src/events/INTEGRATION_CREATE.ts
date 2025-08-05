/**
 * INTEGRATION_CREATE Event
 *
 * Sent when an integration is created.
 */

export interface IntegrationCreateData {
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
  /** The bot/OAuth2 application for discord integrations */
  application?: {
    /** The id of the app */
    id: string;
    /** The name of the app */
    name: string;
    /** The icon hash of the app */
    icon?: string | null;
    /** The description of the app */
    description: string;
    /** An array of rpc origin urls, if rpc is enabled */
    rpc_origins?: string[];
    /** When false only app owner can join the app's bot to guilds */
    bot_public: boolean;
    /** When true the app's bot will only join upon completion of the full oauth2 code grant flow */
    bot_require_code_grant: boolean;
    /** The url of the app's terms of service */
    terms_of_service_url?: string;
    /** The url of the app's privacy policy */
    privacy_policy_url?: string;
    /** Partial user object containing info on the owner of the application */
    owner?: any;
    /** If this application is a game sold on Discord, this field will be the summary field for the store page of its primary sku */
    summary: string;
    /** The hex encoded key for verification in interactions and the GameSDK's GetTicket */
    verify_key: string;
    /** If the application belongs to a team, this will be a list of the members of that team */
    team?: any;
    /** If this application is a game sold on Discord, this field will be the guild to which it has been linked */
    guild_id?: string;
    /** If this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists */
    primary_sku_id?: string;
    /** If this application is a game sold on Discord, this field will be the URL slug that links to the store page */
    slug?: string;
    /** The application's default rich presence invite cover image hash */
    cover_image?: string;
    /** The application's public flags */
    flags?: number;
    /** Up to 5 tags describing the content and functionality of the application */
    tags?: string[];
    /** Settings for the application's default in-app authorization link, if enabled */
    install_params?: any;
    /** The application's default custom authorization link, if enabled */
    custom_install_url?: string;
  };
  /** The guild id */
  guild_id: string;
}

export class IntegrationCreateEventData {
  constructor(public data: IntegrationCreateData) {}

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
   * The application information (for Discord integrations)
   */
  get application() {
    return this.data.application;
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
