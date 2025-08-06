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

export class GuildMembersChunkData {
  constructor(public data: GuildMembersChunkEventData) {}

  /**
   * The guild ID this chunk is for
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Array of guild members in this chunk
   */
  get members() {
    return this.data.members;
  }

  /**
   * The current chunk index
   */
  get chunkIndex() {
    return this.data.chunk_index;
  }

  /**
   * Total number of chunks expected
   */
  get chunkCount() {
    return this.data.chunk_count;
  }

  /**
   * Invalid IDs that were not found
   */
  get notFound() {
    return this.data.not_found || [];
  }

  /**
   * Presences of the returned members
   */
  get presences() {
    return this.data.presences || [];
  }

  /**
   * Nonce from the original request
   */
  get nonce() {
    return this.data.nonce;
  }

  /**
   * Whether this is the final chunk
   */
  get isFinalChunk() {
    return this.data.chunk_index === this.data.chunk_count - 1;
  }

  /**
   * Number of members in this chunk
   */
  get memberCount() {
    return this.data.members.length;
  }
}
