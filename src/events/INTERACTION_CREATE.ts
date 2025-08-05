/**
 * INTERACTION_CREATE Event
 *
 * Emitted when a user interacts with the bot (slash commands, buttons, etc.).
 */

import type { RawInteractionData } from "@/types/gateway/interaction";

export class InteractionCreateEventData {
  constructor(public data: RawInteractionData) {}

  /**
   * The interaction data
   */
  get interaction() {
    return this.data;
  }

  /**
   * Interaction name
   */
  get name() {
    return this.data.data?.name;
  }

  /**
   * Interaction ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * Interaction type
   */
  get type() {
    return this.data.type;
  }

  /**
   * Application ID
   */
  get applicationId() {
    return this.data.application_id;
  }

  /**
   * Interaction token
   */
  get token() {
    return this.data.token;
  }

  /**
   * Channel ID where the interaction occurred
   */
  get channelId() {
    return this.data.channel_id;
  }

  /**
   * Guild ID (if in a guild)
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user who triggered the interaction
   */
  get user() {
    return this.data.user || this.data.member?.user;
  }

  /**
   * The guild member (if in a guild)
   */
  get member() {
    return this.data.member;
  }
}
