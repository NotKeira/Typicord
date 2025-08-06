/**
 * GUILD_MEMBER_UPDATE Event
 *
 * Emitted when a guild member is updated (e.g., nickname changed, roles changed).
 */
import type { GuildMember as RawGuildMember } from "@/types/structures/guild";
import { GuildMember } from "@/structures/GuildMember";
import type { RESTClient } from "@/client/RESTClient";
export interface GuildMemberUpdateEventData extends RawGuildMember {
    /** The guild ID where the member was updated */
    guild_id: string;
}
export declare class GuildMemberUpdateData {
    data: GuildMemberUpdateEventData;
    private readonly _member;
    constructor(data: GuildMemberUpdateEventData, client?: RESTClient);
    /**
     * The updated guild member with full class methods
     */
    get member(): GuildMember;
    /**
     * The user object for the member with full User class functionality
     */
    get user(): import("..").User | undefined;
    /**
     * The guild ID where the member was updated
     */
    get guildId(): string;
    /**
     * The member's nickname in the guild
     */
    get nick(): string | null | undefined;
    /**
     * The member's guild avatar hash
     */
    get avatar(): string | null | undefined;
    /**
     * Array of role IDs the member has
     */
    get roles(): string[];
    /**
     * When the user joined the guild
     */
    get joinedAt(): Date;
    /**
     * When the user started boosting the guild (if applicable)
     */
    get premiumSince(): Date | null;
    /**
     * Whether the user is deafened in voice channels
     */
    get deaf(): boolean;
    /**
     * Whether the user is muted in voice channels
     */
    get mute(): boolean;
    /**
     * Guild member flags represented as a bit set
     */
    get flags(): number;
    /**
     * Whether the user has passed the guild's Membership Screening requirements
     */
    get pending(): boolean | undefined;
    /**
     * When the user's timeout will expire (if applicable)
     */
    get communicationDisabledUntil(): Date | null;
    /**
     * The member's display name (nickname or username)
     */
    get displayName(): string;
}
//# sourceMappingURL=GUILD_MEMBER_UPDATE.d.ts.map