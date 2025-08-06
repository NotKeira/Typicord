/**
 * INVITE_CREATE Event
 *
 * Sent when a new invite to a channel is created.
 */
import type { User } from "@/types/structures/user";
export interface InviteCreateEventData {
    /** Channel the invite is for */
    channel_id: string;
    /** Unique invite code */
    code: string;
    /** Time at which the invite was created */
    created_at: string;
    /** Guild of the invite */
    guild_id?: string;
    /** User that created the invite */
    inviter?: User;
    /** How long the invite is valid for (in seconds) */
    max_age: number;
    /** Maximum number of times the invite can be used */
    max_uses: number;
    /** Type of target for this voice channel invite */
    target_type?: number;
    /** User whose stream to display for this voice channel stream invite */
    target_user?: User;
    /** Whether or not the invite is temporary */
    temporary: boolean;
    /** How many times the invite has been used (always will be 0) */
    uses: number;
}
export declare class InviteCreateData {
    data: InviteCreateEventData;
    constructor(data: InviteCreateEventData);
    /**
     * The channel ID this invite is for
     */
    get channelId(): string;
    /**
     * The unique invite code
     */
    get code(): string;
    /**
     * When the invite was created
     */
    get createdAt(): Date;
    /**
     * The guild ID this invite is for
     */
    get guildId(): string | undefined;
    /**
     * The user who created the invite
     */
    get inviter(): User | undefined;
    /**
     * How long the invite is valid for (in seconds)
     */
    get maxAge(): number;
    /**
     * Maximum number of times the invite can be used
     */
    get maxUses(): number;
    /**
     * Whether the invite is temporary
     */
    get isTemporary(): boolean;
    /**
     * How many times the invite has been used
     */
    get uses(): number;
    /**
     * The full invite URL
     */
    get url(): string;
    /**
     * Whether the invite has unlimited uses
     */
    get hasUnlimitedUses(): boolean;
    /**
     * Whether the invite never expires
     */
    get neverExpires(): boolean;
}
//# sourceMappingURL=INVITE_CREATE.d.ts.map