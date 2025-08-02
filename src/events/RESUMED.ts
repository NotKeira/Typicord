/**
 * RESUMED Event
 *
 * Emitted when the client has successfully resumed a previous session.
 * This event has no data payload.
 */

export class ResumedEventData {
  constructor() {}

  /**
   * Returns the event name
   */
  get eventName() {
    return "RESUMED";
  }

  /**
   * Returns a string representation of the event
   */
  toString() {
    return "Session resumed successfully";
  }
}
