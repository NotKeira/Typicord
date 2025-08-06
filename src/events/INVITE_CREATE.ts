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

export class InviteCreateData {
  constructor(public data: InviteCreateEventData) {}

  /**
   * The channel ID this invite is for
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * The unique invite code
   */
  get code() {
    return this.data.code;
  }

  /**
   * When the invite was created
   */
  get createdAt() {
    return new Date(this.data.created_at);
  }

  /**
   * The guild ID this invite is for
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user who created the invite
   */
  get inviter() {
    return this.data.inviter;
  }

  /**
   * How long the invite is valid for (in seconds)
   */
  get maxAge() {
    return this.data.max_age;
  }

  /**
   * Maximum number of times the invite can be used
   */
  get maxUses() {
    return this.data.max_uses;
  }

  /**
   * Whether the invite is temporary
   */
  get isTemporary() {
    return this.data.temporary;
  }

  /**
   * How many times the invite has been used
   */
  get uses() {
    return this.data.uses;
  }

  /**
   * The full invite URL
   */
  get url() {
    return `https://discord.gg/${this.data.code}`;
  }

  /**
   * Whether the invite has unlimited uses
   */
  get hasUnlimitedUses() {
    return this.data.max_uses === 0;
  }

  /**
   * Whether the invite never expires
   */
  get neverExpires() {
    return this.data.max_age === 0;
  }
}
