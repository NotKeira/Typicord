/**
 * Comprehensive Audit Log System for Discord Events
 * Provides structured logging with filtering, search, and analysis capabilities
 */
export declare enum AuditLogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    CRITICAL = 4
}
export declare enum AuditLogCategory {
    GATEWAY = "gateway",
    API = "api",
    COMMAND = "command",
    EVENT = "event",
    CACHE = "cache",
    RATE_LIMIT = "rate_limit",
    ERROR = "error",
    USER_ACTION = "user_action",
    ADMIN_ACTION = "admin_action",
    SECURITY = "security",
    PERFORMANCE = "performance",
    SYSTEM = "system"
}
interface AuditLogEntry {
    id: string;
    timestamp: number;
    level: AuditLogLevel;
    category: AuditLogCategory;
    message: string;
    details?: Record<string, any>;
    userId?: string;
    guildId?: string;
    channelId?: string;
    sourceIp?: string;
    userAgent?: string;
    correlationId?: string;
    duration?: number;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string | number;
    };
    metadata?: Record<string, any>;
}
interface AuditLogQuery {
    level?: AuditLogLevel;
    category?: AuditLogCategory;
    userId?: string;
    guildId?: string;
    channelId?: string;
    startTime?: number;
    endTime?: number;
    search?: string;
    correlationId?: string;
    limit?: number;
    offset?: number;
}
interface AuditLogConfig {
    maxEntries?: number;
    retentionDays?: number;
    enabledCategories?: AuditLogCategory[];
    minLevel?: AuditLogLevel;
    autoFlush?: boolean;
    flushInterval?: number;
    exportFormat?: "json" | "csv" | "tsv";
}
export declare class AuditLogger {
    private readonly entries;
    private readonly config;
    private flushTimer?;
    private entryIdCounter;
    constructor(config?: AuditLogConfig);
    /**
     * Log a debug message
     */
    debug(category: AuditLogCategory, message: string, details?: Partial<AuditLogEntry>): void;
    /**
     * Log an info message
     */
    info(category: AuditLogCategory, message: string, details?: Partial<AuditLogEntry>): void;
    /**
     * Log a warning message
     */
    warn(category: AuditLogCategory, message: string, details?: Partial<AuditLogEntry>): void;
    /**
     * Log an error message
     */
    error(category: AuditLogCategory, message: string, error?: Error, details?: Partial<AuditLogEntry>): void;
    /**
     * Log a critical message
     */
    critical(category: AuditLogCategory, message: string, error?: Error, details?: Partial<AuditLogEntry>): void;
    /**
     * Log a gateway event
     */
    logGatewayEvent(eventName: string, data?: any, duration?: number): void;
    /**
     * Log an API request
     */
    logApiRequest(method: string, endpoint: string, statusCode: number, duration: number, details?: any): void;
    /**
     * Log a command execution
     */
    logCommand(commandName: string, userId: string, guildId?: string, channelId?: string, success?: boolean, duration?: number): void;
    /**
     * Log a user action
     */
    logUserAction(action: string, userId: string, guildId?: string, channelId?: string, details?: any): void;
    /**
     * Log an admin action
     */
    logAdminAction(action: string, adminId: string, targetId?: string, guildId?: string, details?: any): void;
    /**
     * Log a security event
     */
    logSecurityEvent(event: string, userId?: string, sourceIp?: string, details?: any): void;
    /**
     * Log a performance metric
     */
    logPerformance(metric: string, value: number, unit: string, details?: any): void;
    /**
     * Log a rate limit event
     */
    logRateLimit(route: string, remaining: number, resetAt: number, isGlobal?: boolean): void;
    /**
     * Log a cache operation
     */
    logCacheOperation(operation: string, cacheType: string, key: string, hit?: boolean, details?: any): void;
    /**
     * Create a correlation ID for related log entries
     */
    createCorrelationId(): string;
    /**
     * Time a function and log its execution
     */
    timeFunction<T>(category: AuditLogCategory, name: string, fn: () => Promise<T> | T, details?: Partial<AuditLogEntry>): Promise<T>;
    /**
     * Query audit log entries
     */
    query(query?: AuditLogQuery): AuditLogEntry[];
    /**
     * Get audit log statistics
     */
    getStatistics(): {
        totalEntries: number;
        entriesByLevel: Record<string, number>;
        entriesByCategory: Record<string, number>;
        oldestEntry?: number;
        newestEntry?: number;
        avgEntriesPerDay: number;
    };
    /**
     * Export audit logs in various formats
     */
    export(format?: "json" | "csv" | "tsv", query?: AuditLogQuery): string;
    /**
     * Clear old entries based on retention policy
     */
    cleanup(): void;
    /**
     * Get recent entries by level
     */
    getRecentErrors(hours?: number): AuditLogEntry[];
    /**
     * Get entries for a specific user
     */
    getUserActivity(userId: string, hours?: number): AuditLogEntry[];
    /**
     * Get entries for a specific guild
     */
    getGuildActivity(guildId: string, hours?: number): AuditLogEntry[];
    /**
     * Destroy the logger and cleanup resources
     */
    destroy(): void;
    /**
     * Core logging method
     */
    private log;
    /**
     * Export entries as CSV/TSV
     */
    private exportCsv;
    /**
     * Start automatic cleanup
     */
    private startAutoFlush;
}
export {};
//# sourceMappingURL=AuditLogger.d.ts.map