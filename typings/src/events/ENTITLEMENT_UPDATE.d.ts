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
export declare class EntitlementUpdateData {
    data: EntitlementUpdateEventData;
    constructor(data: EntitlementUpdateEventData);
    /**
     * The entitlement ID
     */
    get id(): string;
    /**
     * The SKU ID
     */
    get skuId(): string;
    /**
     * The application ID
     */
    get applicationId(): string;
    /**
     * The user ID who received the entitlement
     */
    get userId(): string | undefined;
    /**
     * The entitlement type
     */
    get type(): number;
    /**
     * Whether the entitlement is deleted
     */
    get isDeleted(): boolean;
    /**
     * When the entitlement starts
     */
    get startsAt(): Date | null;
    /**
     * When the entitlement ends
     */
    get endsAt(): Date | null;
    /**
     * The guild ID if this is a guild entitlement
     */
    get guildId(): string | undefined;
    /**
     * Whether the consumable entitlement has been consumed
     */
    get isConsumed(): boolean | undefined;
    /**
     * Whether this is a user entitlement
     */
    get isUserEntitlement(): boolean;
    /**
     * Whether this is a guild entitlement
     */
    get isGuildEntitlement(): boolean;
    /**
     * Whether this is a test entitlement
     */
    get isTestEntitlement(): boolean;
    /**
     * Whether this entitlement is currently active
     */
    get isActive(): boolean;
}
//# sourceMappingURL=ENTITLEMENT_UPDATE.d.ts.map