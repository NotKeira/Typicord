/**
 * ENTITLEMENT_DELETE Event
 *
 * Sent when an entitlement is deleted.
 */

export interface EntitlementDeleteData {
  /** ID of the entitlement */
  id: string;
  /** ID of the SKU */
  sku_id: string;
  /** ID of the parent application */
  application_id: string;
  /** ID of the user that is granted access to the entitlement's sku */
  user_id?: string;
  /** Type of entitlement */
  type: number;
  /** Entitlement was deleted */
  deleted: boolean;
  /** Start date at which the entitlement is valid. Not present when using test entitlements. */
  starts_at?: string;
  /** Date at which the entitlement is no longer valid. Not present when using test entitlements. */
  ends_at?: string;
  /** ID of the guild that is granted access to the entitlement's sku */
  guild_id?: string;
  /** For consumable items, whether or not the entitlement has been consumed */
  consumed?: boolean;
}

export class EntitlementDeleteEventData {
  constructor(public data: EntitlementDeleteData) {}

  /**
   * The entitlement ID
   */
  get id() {
    return this.data.id;
  }

  /**
   * The SKU ID
   */
  get skuId() {
    return this.data.sku_id;
  }

  /**
   * The application ID
   */
  get applicationId() {
    return this.data.application_id;
  }

  /**
   * The user ID who had the entitlement
   */
  get userId() {
    return this.data.user_id;
  }

  /**
   * The entitlement type
   */
  get type() {
    return this.data.type;
  }

  /**
   * Whether the entitlement was deleted
   */
  get wasDeleted() {
    return this.data.deleted;
  }

  /**
   * When the entitlement started
   */
  get startsAt() {
    return this.data.starts_at ? new Date(this.data.starts_at) : null;
  }

  /**
   * When the entitlement ended
   */
  get endsAt() {
    return this.data.ends_at ? new Date(this.data.ends_at) : null;
  }

  /**
   * The guild ID if this was a guild entitlement
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Whether the consumable entitlement was consumed
   */
  get wasConsumed() {
    return this.data.consumed;
  }

  /**
   * Whether this was a user entitlement
   */
  get wasUserEntitlement() {
    return !!this.data.user_id;
  }

  /**
   * Whether this was a guild entitlement
   */
  get wasGuildEntitlement() {
    return !!this.data.guild_id;
  }

  /**
   * Whether this was a test entitlement
   */
  get wasTestEntitlement() {
    return !this.data.starts_at && !this.data.ends_at;
  }
}
