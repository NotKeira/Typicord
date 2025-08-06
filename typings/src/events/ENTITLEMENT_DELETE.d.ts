/**
 * ENTITLEMENT_DELETE Event
 *
 * Sent when an entitlement is deleted.
 */
export interface EntitlementDeleteEventData {
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
export declare class EntitlementDeleteData {
    data: EntitlementDeleteEventData;
    constructor(data: EntitlementDeleteEventData);
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
     * The user ID who had the entitlement
     */
    get userId(): string | undefined;
    /**
     * The entitlement type
     */
    get type(): number;
    /**
     * Whether the entitlement was deleted
     */
    get wasDeleted(): boolean;
    /**
     * When the entitlement started
     */
    get startsAt(): Date | null;
    /**
     * When the entitlement ended
     */
    get endsAt(): Date | null;
    /**
     * The guild ID if this was a guild entitlement
     */
    get guildId(): string | undefined;
    /**
     * Whether the consumable entitlement was consumed
     */
    get wasConsumed(): boolean | undefined;
    /**
     * Whether this was a user entitlement
     */
    get wasUserEntitlement(): boolean;
    /**
     * Whether this was a guild entitlement
     */
    get wasGuildEntitlement(): boolean;
    /**
     * Whether this was a test entitlement
     */
    get wasTestEntitlement(): boolean;
}
//# sourceMappingURL=ENTITLEMENT_DELETE.d.ts.map