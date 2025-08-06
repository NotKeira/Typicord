/**
 * Typicord Debug System
 *
 * Automatically checks the TYPI_DEBUG environment variable to enable debug logging.
 * Set TYPI_DEBUG=true in your .env file to enable debug output from Typicord.
 */
/**
 * Available debug namespaces for fine-grained control
 */
export declare enum DebugNamespace {
    GATEWAY = "gateway",
    REST = "rest",
    CACHE = "cache",
    EVENTS = "events",
    STRUCTURES = "structures",
    HEARTBEAT = "heartbeat",
    RECONNECTION = "reconnection",
    INTERACTION = "interaction",
    COMMANDS = "commands",
    COMPONENTS = "components",
    ALL = "*"
}
/**
 * Debug logger functions
 */
export declare const debug: {
    /**
     * Log a debug message
     */
    log(namespace: DebugNamespace, message: string, ...args: any[]): void;
    /**
     * Log an info message
     */
    info(namespace: DebugNamespace, message: string, ...args: any[]): void;
    /**
     * Log a warning message
     */
    warn(namespace: DebugNamespace, message: string, ...args: any[]): void;
    /**
     * Log an error message
     */
    error(namespace: DebugNamespace, message: string, error?: Error, ...args: any[]): void;
    /**
     * Log a trace message (for very verbose debugging)
     */
    trace(namespace: DebugNamespace, message: string, ...args: any[]): void;
    /**
     * Log an object/data structure
     */
    data(namespace: DebugNamespace, label: string, data: any): void;
    /**
     * Time a function execution
     */
    time<T>(namespace: DebugNamespace, label: string, fn: () => T): T;
    /**
     * Time an async function execution
     */
    timeAsync<T>(namespace: DebugNamespace, label: string, fn: () => Promise<T>): Promise<T>;
};
/**
 * Configure debug namespaces (optional, defaults to all)
 * @param namespaces Array of namespaces to enable, or 'ALL' for everything
 */
export declare function configureDebugNamespaces(namespaces: DebugNamespace[]): void;
//# sourceMappingURL=index.d.ts.map