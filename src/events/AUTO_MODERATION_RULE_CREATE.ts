/**
 * AUTO_MODERATION_RULE_CREATE Event
 *
 * Sent when an auto moderation rule is created.
 */

export interface AutoModerationRuleCreateEventData {
  /** The id of the rule */
  id: string;
  /** The guild ID */
  guild_id: string;
  /** The rule name */
  name: string;
  /** The user which first created this rule */
  creator_id: string;
  /** The rule event type */
  event_type: number;
  /** The rule trigger type */
  trigger_type: number;
  /** The rule trigger metadata */
  trigger_metadata: {
    /** Substrings which will be searched for in content */
    keyword_filter?: string[];
    /** Regular expression patterns which will be matched against content */
    regex_patterns?: string[];
    /** The internally pre-defined wordsets which will be searched for in content */
    presets?: number[];
    /** Substrings which should not trigger the rule */
    allow_list?: string[];
    /** Total number of unique role and user mentions allowed per message */
    mention_total_limit?: number;
    /** Whether to automatically detect mention raids */
    mention_raid_protection_enabled?: boolean;
  };
  /** The actions which will execute when the rule is triggered */
  actions: Array<{
    /** The type of action */
    type: number;
    /** Additional metadata needed during execution for this specific action type */
    metadata?: {
      /** Channel to which user content should be logged */
      channel_id?: string;
      /** Timeout duration in seconds */
      duration_seconds?: number;
      /** Additional explanation that will be shown to members whenever their message is blocked */
      custom_message?: string;
    };
  }>;
  /** Whether the rule is enabled */
  enabled: boolean;
  /** The role ids that should not be affected by the rule */
  exempt_roles: string[];
  /** The channel ids that should not be affected by the rule */
  exempt_channels: string[];
}

export class AutoModerationRuleCreateData {
  constructor(public data: AutoModerationRuleCreateEventData) {}

  /**
   * The rule ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * The guild ID where the rule was created
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The rule name
   */
  get name() {
    return this.data.name;
  }

  /**
   * The user who created this rule
   */
  get creatorId() {
    return this.data.creator_id;
  }

  /**
   * The rule event type
   */
  get eventType() {
    return this.data.event_type;
  }

  /**
   * The rule trigger type
   */
  get triggerType() {
    return this.data.trigger_type;
  }

  /**
   * The rule trigger metadata
   */
  get triggerMetadata() {
    return this.data.trigger_metadata;
  }

  /**
   * The actions that will execute when triggered
   */
  get actions() {
    return this.data.actions;
  }

  /**
   * Whether the rule is enabled
   */
  get isEnabled() {
    return this.data.enabled;
  }

  /**
   * Role IDs exempt from this rule
   */
  get exemptRoles() {
    return this.data.exempt_roles;
  }

  /**
   * Channel IDs exempt from this rule
   */
  get exemptChannels() {
    return this.data.exempt_channels;
  }

  /**
   * Whether this rule has keyword filtering
   */
  get hasKeywordFilter() {
    return !!this.data.trigger_metadata.keyword_filter?.length;
  }

  /**
   * Whether this rule has regex patterns
   */
  get hasRegexPatterns() {
    return !!this.data.trigger_metadata.regex_patterns?.length;
  }

  /**
   * Whether this rule has mention limits
   */
  get hasMentionLimit() {
    return this.data.trigger_metadata.mention_total_limit !== undefined;
  }
}
