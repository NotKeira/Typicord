/**
 * GUILD_MEMBERS_CHUNK Event
 *
 * Sent in response to Guild Request Members.
 */
import type { GuildMember } from "@/structures/Guild";
export interface GuildMembersChunkEventData {
    /** ID of the guild */
    guild_id: string;
    /** Set of guild members */
    members: GuildMember[];
    /** Chunk index in the expected chunks for this response */
    chunk_index: number;
    /** Total number of expected chunks for this response */
    chunk_count: number;
    /** When passing an invalid ID to REQUEST_GUILD_MEMBERS, it will be returned here */
    not_found?: string[];
    /** When passing true to REQUEST_GUILD_MEMBERS, presences of the returned members will be here */
    presences?: any[];
    /** Nonce used in the Guild Members Request */
    nonce?: string;
}
export declare class GuildMembersChunkData {
    data: GuildMembersChunkEventData;
    constructor(data: GuildMembersChunkEventData);
    /**
     * The guild ID this chunk is for
     */
    get guildId(): string;
    /**
     * Array of guild members in this chunk
     */
    get members(): GuildMember[];
    /**
     * The current chunk index
     */
    get chunkIndex(): number;
    /**
     * Total number of chunks expected
     */
    get chunkCount(): number;
    /**
     * Invalid IDs that were not found
     */
    get notFound(): string[];
    /**
     * Presences of the returned members
     */
    get presences(): any[];
    /**
     * Nonce from the original request
     */
    get nonce(): string | undefined;
    /**
     * Whether this is the final chunk
     */
    get isFinalChunk(): boolean;
    /**
     * Number of members in this chunk
     */
    get memberCount(): number;
}
//# sourceMappingURL=GUILD_MEMBERS_CHUNK.d.ts.map