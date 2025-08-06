/**
 * AUTO_MODERATION_ACTION_EXECUTION Event
 *
 * Sent when an auto moderation rule is triggered and an action is executed.
 */
export interface AutoModerationActionExecutionEventData {
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
export declare class AutoModerationActionExecutionData {
    data: AutoModerationActionExecutionEventData;
    constructor(data: AutoModerationActionExecutionEventData);
    /**
     * The guild ID where the action was executed
     */
    get guildId(): string;
    /**
     * The action that was executed
     */
    get action(): {
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
    /**
     * The rule ID that triggered this action
     */
    get ruleId(): string;
    /**
     * The rule trigger type
     */
    get ruleTriggerType(): number;
    /**
     * The user who triggered the rule
     */
    get userId(): string;
    /**
     * The channel where content was posted
     */
    get channelId(): string | undefined;
    /**
     * The message ID that triggered the rule
     */
    get messageId(): string | undefined;
    /**
     * System message ID posted as result of this action
     */
    get alertSystemMessageId(): string | undefined;
    /**
     * The content that triggered the rule
     */
    get content(): string;
    /**
     * The keyword that triggered the rule
     */
    get matchedKeyword(): string | null | undefined;
    /**
     * The specific content substring that triggered the rule
     */
    get matchedContent(): string | null | undefined;
    /**
     * The action type that was executed
     */
    get actionType(): number;
    /**
     * Action metadata
     */
    get actionMetadata(): {
        /** Channel to which user content should be logged */
        channel_id?: string;
        /** Timeout duration in seconds */
        duration_seconds?: number;
        /** Additional explanation that will be shown to members whenever their message is blocked */
        custom_message?: string;
    } | undefined;
    /**
     * Whether this action was a timeout
     */
    get isTimeoutAction(): boolean;
    /**
     * Whether this action was a message block
     */
    get isBlockMessageAction(): boolean;
    /**
     * Whether this action was sending an alert
     */
    get isSendAlertAction(): boolean;
    /**
     * Timeout duration if this was a timeout action
     */
    get timeoutDuration(): number | undefined;
    /**
     * Custom message shown to user if blocked
     */
    get customMessage(): string | undefined;
    /**
     * Alert channel ID if this was an alert action
     */
    get alertChannelId(): string | undefined;
}
//# sourceMappingURL=AUTO_MODERATION_ACTION_EXECUTION.d.ts.map