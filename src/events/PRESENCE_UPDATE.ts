/**
 * PRESENCE_UPDATE Event
 *
 * Emitted when a user's presence is updated (status, activity, etc.).
 */

import type { PresenceUpdateEvent } from "@/types/gateway/events";

export class PresenceUpdateEventData {
  constructor(public data: PresenceUpdateEvent) {}

  /**
   * The user whose presence was updated
   */
  get user() {
    return this.data.user;
  }

  /**
   * Guild ID where the presence was updated
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * The user's new status
   */
  get status() {
    return this.data.status;
  }

  /**
   * The user's activities
   */
  get activities() {
    return this.data.activities;
  }

  /**
   * Client status breakdown
   */
  get clientStatus() {
    return this.data.client_status;
  }

  /**
   * Whether the user is online
   */
  get isOnline() {
    return this.data.status === "online";
  }

  /**
   * Whether the user is idle
   */
  get isIdle() {
    return this.data.status === "idle";
  }

  /**
   * Whether the user is in do not disturb mode
   */
  get isDnd() {
    return this.data.status === "dnd";
  }

  /**
   * Whether the user is offline
   */
  get isOffline() {
    return this.data.status === "offline";
  }
}
