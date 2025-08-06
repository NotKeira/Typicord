/**
 * ENTITLEMENT_UPDATE Event
 *
 * Sent when an entitlement is updated.
 */

export interface EntitlementUpdateEventData {
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

export class EntitlementUpdateData {
  constructor(public data: EntitlementUpdateEventData) {}

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
   * The user ID who received the entitlement
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
   * Whether the entitlement is deleted
   */
  get isDeleted() {
    return this.data.deleted;
  }

  /**
   * When the entitlement starts
   */
  get startsAt() {
    return this.data.starts_at ? new Date(this.data.starts_at) : null;
  }

  /**
   * When the entitlement ends
   */
  get endsAt() {
    return this.data.ends_at ? new Date(this.data.ends_at) : null;
  }

  /**
   * The guild ID if this is a guild entitlement
   */
  get guildId() {
    return this.data.guild_id;
  }

  /**
   * Whether the consumable entitlement has been consumed
   */
  get isConsumed() {
    return this.data.consumed;
  }

  /**
   * Whether this is a user entitlement
   */
  get isUserEntitlement() {
    return !!this.data.user_id;
  }

  /**
   * Whether this is a guild entitlement
   */
  get isGuildEntitlement() {
    return !!this.data.guild_id;
  }

  /**
   * Whether this is a test entitlement
   */
  get isTestEntitlement() {
    return !this.data.starts_at && !this.data.ends_at;
  }

  /**
   * Whether this entitlement is currently active
   */
  get isActive() {
    if (this.data.deleted) return false;
    if (this.isTestEntitlement) return true;

    const now = new Date();
    const starts = this.startsAt;
    const ends = this.endsAt;

    if (starts && now < starts) return false;
    if (ends && now > ends) return false;

    return true;
  }
}
