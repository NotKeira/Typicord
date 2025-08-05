/**
 * AUTO_MODERATION_ACTION_EXECUTION Event
 *
 * Sent when an auto moderation rule is triggered and an action is executed.
 */

export interface AutoModerationActionExecutionData {
  /** The guild ID where the action was executed */
  guild_id: string;
  /** The action which was executed */
  action: {
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
  };
  /** The id of the rule which action belongs to */
  rule_id: string;
  /** The trigger type of rule which was triggered */
  rule_trigger_type: number;
  /** The user which generated the content which triggered the rule */
  user_id: string;
  /** The channel in which user content was posted */
  channel_id?: string;
  /** The message id of the message which triggered the rule */
  message_id?: string;
  /** The id of any system auto moderation messages posted as a result of this action */
  alert_system_message_id?: string;
  /** The user generated text content which triggered the rule */
  content: string;
  /** The word or phrase configured in the rule that triggered the rule */
  matched_keyword?: string | null;
  /** The substring in content that triggered the rule */
  matched_content?: string | null;
}

export class AutoModerationActionExecutionEventData {
  constructor(public data: AutoModerationActionExecutionData) {}

  /**
   * The guild ID where the action was executed
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The action that was executed
   */
  get action() {
    return this.data.action;
  }

  /**
   * The rule ID that triggered this action
   */
  get ruleId() {
    return this.data.rule_id;
  }

  /**
   * The rule trigger type
   */
  get ruleTriggerType() {
    return this.data.rule_trigger_type;
  }

  /**
   * The user who triggered the rule
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * The channel where content was posted
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The message ID that triggered the rule
   */
  get messageId() {
    return this.data.message_id;
  }

  /**
   * System message ID posted as result of this action
   */
  get alertSystemMessageId() {
    return this.data.alert_system_message_id;
  }

  /**
   * The content that triggered the rule
   */
  get content() {
    return this.data.content;
  }

  /**
   * The keyword that triggered the rule
   */
  get matchedKeyword() {
    return this.data.matched_keyword;
  }

  /**
   * The specific content substring that triggered the rule
   */
  get matchedContent() {
    return this.data.matched_content;
  }

  /**
   * The action type that was executed
   */
  get actionType() {
    return this.data.action.type;
  }

  /**
   * Action metadata
   */
  get actionMetadata() {
    return this.data.action.metadata;
  }

  /**
   * Whether this action was a timeout
   */
  get isTimeoutAction() {
    return this.data.action.type === 2; // TIMEOUT action type
  }

  /**
   * Whether this action was a message block
   */
  get isBlockMessageAction() {
    return this.data.action.type === 1; // BLOCK_MESSAGE action type
  }

  /**
   * Whether this action was sending an alert
   */
  get isSendAlertAction() {
    return this.data.action.type === 3; // SEND_ALERT_MESSAGE action type
  }

  /**
   * Timeout duration if this was a timeout action
   */
  get timeoutDuration() {
    return this.data.action.metadata?.duration_seconds;
  }

  /**
   * Custom message shown to user if blocked
   */
  get customMessage() {
    return this.data.action.metadata?.custom_message;
  }

  /**
   * Alert channel ID if this was an alert action
   */
  get alertChannelId() {
    return this.data.action.metadata?.channel_id;
  }
}
