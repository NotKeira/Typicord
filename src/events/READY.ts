/**
 * READY Event
 *
 * Emitted when the client has successfully connected to Discord and is ready to operate.
 * This event contains initial session data including user information, guilds, and session details.
 */

import type { ReadyEvent } from "@/types/gateway/events";

export class ReadyEventData {
  constructor(public data: ReadyEvent) {}

  /**
   * The bot user information
   */
  get user() {
    return this.data.user;
  }

  /**
   * The guilds the bot is in (may be unavailable during startup)
   */
  get guilds() {
    return this.data.guilds;
  }

  /**
   * The session ID for this connection
   */
  get sessionId() {
    return this.data.session_id;
  }

  /**
   * The gateway URL to use for resuming connections
   */
  get resumeGatewayUrl() {
    return this.data.resume_gateway_url;
  }

  /**
   * Application information
   */
  get application() {
    return this.data.application;
  }

  /**
   * Gateway API version
   */
  get version() {
    return this.data.v;
  }
}

export type { ReadyEvent };
