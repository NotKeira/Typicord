/**
 * AUTO_MODERATION_RULE_DELETE Event
 *
 * Sent when an auto moderation rule is deleted.
 */
export interface AutoModerationRuleDeleteEventData {
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
export declare class AutoModerationRuleDeleteData {
    data: AutoModerationRuleDeleteEventData;
    constructor(data: AutoModerationRuleDeleteEventData);
    /**
     * The rule ID
     */
    get id(): string;
    /**
     * The guild ID where the rule was deleted
     */
    get guildId(): string;
    /**
     * The rule name
     */
    get name(): string;
    /**
     * The user who created this rule
     */
    get creatorId(): string;
    /**
     * The rule event type
     */
    get eventType(): number;
    /**
     * The rule trigger type
     */
    get triggerType(): number;
    /**
     * The rule trigger metadata
     */
    get triggerMetadata(): {
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
    /**
     * The actions that will execute when triggered
     */
    get actions(): {
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
    }[];
    /**
     * Whether the rule is enabled
     */
    get isEnabled(): boolean;
    /**
     * Role IDs exempt from this rule
     */
    get exemptRoles(): string[];
    /**
     * Channel IDs exempt from this rule
     */
    get exemptChannels(): string[];
    /**
     * Whether this rule had keyword filtering
     */
    get hadKeywordFilter(): boolean;
    /**
     * Whether this rule had regex patterns
     */
    get hadRegexPatterns(): boolean;
    /**
     * Whether this rule had mention limits
     */
    get hadMentionLimit(): boolean;
}
//# sourceMappingURL=AUTO_MODERATION_RULE_DELETE.d.ts.map