import { TypedEventEmitter } from "@/events/TypedEventEmitter";
import type { ClientEvents } from "@/types/ClientEvents";
/**
 * Enhanced Client class with static methods and improved event handling
 */
export declare class EnhancedClient extends TypedEventEmitter {
    /**
     * Static method to wait for a single event emission
     * @param eventEmitter The event emitter to listen on
     * @param eventName The event to wait for
     * @param options Optional configuration
     * @returns Promise that resolves with the event data
     */
    static once<Emitter extends EnhancedClient, Event extends keyof ClientEvents>(eventEmitter: Emitter, eventName: Emitter extends EnhancedClient ? Event : string | symbol, options?: {
        signal?: AbortSignal;
    }): Promise<Emitter extends EnhancedClient ? [ClientEvents[Event]] : any[]>;
    /**
     * Listens for events with additional options like timeouts and conditions
     * @param event The event to listen for
     * @param options Listening options
     */
    waitFor<K extends keyof ClientEvents>(event: K, options?: {
        /** Maximum time to wait in milliseconds */
        timeout?: number;
        /** Condition function that must return true for the promise to resolve */
        filter?: (data: ClientEvents[K]) => boolean;
        /** Maximum number of events to collect before resolving */
        max?: number;
        /** Whether to collect all matching events or just the first */
        collect?: boolean;
    }): Promise<ClientEvents[K] | ClientEvents[K][]>;
    /**
     * Override the on method to support ClientEvents
     */
    on<K extends keyof ClientEvents>(event: K, listener: (data: ClientEvents[K]) => void): this;
    /**
     * Override the once method to support ClientEvents
     */
    once<K extends keyof ClientEvents>(event: K, listener: (data: ClientEvents[K]) => void): this;
    /**
     * Override the off method to support ClientEvents
     */
    off<K extends keyof ClientEvents>(event: K, listener: (data: ClientEvents[K]) => void): this;
    /**
     * Override emit to support ClientEvents
     */
    emit<K extends keyof ClientEvents>(event: K, data: ClientEvents[K]): boolean;
    /**
     * Emit error events with proper error handling
     */
    emitError(error: Error): void;
    /**
     * Emit warning events
     */
    emitWarn(message: string): void;
    /**
     * Emit debug events
     */
    emitDebug(message: string): void;
}
//# sourceMappingURL=EnhancedClient.d.ts.map