/**
 * Comprehensive Audit Log System for Discord Events
 * Provides structured logging with filtering, search, and analysis capabilities
 */

export enum AuditLogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export enum AuditLogCategory {
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
  SYSTEM = "system",
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

export class AuditLogger {
  private readonly entries: AuditLogEntry[] = [];
  private readonly config: Required<AuditLogConfig>;
  private flushTimer?: NodeJS.Timeout;
  private entryIdCounter = 0;

  constructor(config: AuditLogConfig = {}) {
    this.config = {
      maxEntries: config.maxEntries || 10000,
      retentionDays: config.retentionDays || 30,
      enabledCategories:
        config.enabledCategories || Object.values(AuditLogCategory),
      minLevel: config.minLevel || AuditLogLevel.INFO,
      autoFlush: config.autoFlush !== false,
      flushInterval: config.flushInterval || 300000, // 5 minutes
      exportFormat: config.exportFormat || "json",
    };

    if (this.config.autoFlush) {
      this.startAutoFlush();
    }
  }

  /**
   * Log a debug message
   */
  debug(
    category: AuditLogCategory,
    message: string,
    details?: Partial<AuditLogEntry>
  ): void {
    this.log(AuditLogLevel.DEBUG, category, message, details);
  }

  /**
   * Log an info message
   */
  info(
    category: AuditLogCategory,
    message: string,
    details?: Partial<AuditLogEntry>
  ): void {
    this.log(AuditLogLevel.INFO, category, message, details);
  }

  /**
   * Log a warning message
   */
  warn(
    category: AuditLogCategory,
    message: string,
    details?: Partial<AuditLogEntry>
  ): void {
    this.log(AuditLogLevel.WARN, category, message, details);
  }

  /**
   * Log an error message
   */
  error(
    category: AuditLogCategory,
    message: string,
    error?: Error,
    details?: Partial<AuditLogEntry>
  ): void {
    const errorDetails = error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: (error as any).code,
        }
      : undefined;

    this.log(AuditLogLevel.ERROR, category, message, {
      ...details,
      error: errorDetails,
    });
  }

  /**
   * Log a critical message
   */
  critical(
    category: AuditLogCategory,
    message: string,
    error?: Error,
    details?: Partial<AuditLogEntry>
  ): void {
    const errorDetails = error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: (error as any).code,
        }
      : undefined;

    this.log(AuditLogLevel.CRITICAL, category, message, {
      ...details,
      error: errorDetails,
    });
  }

  /**
   * Log a gateway event
   */
  logGatewayEvent(eventName: string, data?: any, duration?: number): void {
    this.info(AuditLogCategory.GATEWAY, `Gateway event: ${eventName}`, {
      details: { eventName, data },
      duration,
    });
  }

  /**
   * Log an API request
   */
  logApiRequest(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    details?: any
  ): void {
    const level = statusCode >= 400 ? AuditLogLevel.WARN : AuditLogLevel.INFO;

    this.log(
      level,
      AuditLogCategory.API,
      `API ${method} ${endpoint} - ${statusCode}`,
      {
        details: { method, endpoint, statusCode, ...details },
        duration,
      }
    );
  }

  /**
   * Log a command execution
   */
  logCommand(
    commandName: string,
    userId: string,
    guildId?: string,
    channelId?: string,
    success = true,
    duration?: number
  ): void {
    const level = success ? AuditLogLevel.INFO : AuditLogLevel.WARN;

    this.log(
      level,
      AuditLogCategory.COMMAND,
      `Command executed: ${commandName}`,
      {
        userId,
        guildId,
        channelId,
        details: { commandName, success },
        duration,
      }
    );
  }

  /**
   * Log a user action
   */
  logUserAction(
    action: string,
    userId: string,
    guildId?: string,
    channelId?: string,
    details?: any
  ): void {
    this.info(AuditLogCategory.USER_ACTION, `User action: ${action}`, {
      userId,
      guildId,
      channelId,
      details: { action, ...details },
    });
  }

  /**
   * Log an admin action
   */
  logAdminAction(
    action: string,
    adminId: string,
    targetId?: string,
    guildId?: string,
    details?: any
  ): void {
    this.info(AuditLogCategory.ADMIN_ACTION, `Admin action: ${action}`, {
      userId: adminId,
      guildId,
      details: { action, adminId, targetId, ...details },
    });
  }

  /**
   * Log a security event
   */
  logSecurityEvent(
    event: string,
    userId?: string,
    sourceIp?: string,
    details?: any
  ): void {
    this.warn(AuditLogCategory.SECURITY, `Security event: ${event}`, {
      userId,
      sourceIp,
      details: { event, ...details },
    });
  }

  /**
   * Log a performance metric
   */
  logPerformance(
    metric: string,
    value: number,
    unit: string,
    details?: any
  ): void {
    this.info(
      AuditLogCategory.PERFORMANCE,
      `Performance: ${metric} = ${value}${unit}`,
      {
        details: { metric, value, unit, ...details },
      }
    );
  }

  /**
   * Log a rate limit event
   */
  logRateLimit(
    route: string,
    remaining: number,
    resetAt: number,
    isGlobal = false
  ): void {
    const level = remaining === 0 ? AuditLogLevel.WARN : AuditLogLevel.DEBUG;

    this.log(level, AuditLogCategory.RATE_LIMIT, `Rate limit: ${route}`, {
      details: { route, remaining, resetAt, isGlobal },
    });
  }

  /**
   * Log a cache operation
   */
  logCacheOperation(
    operation: string,
    cacheType: string,
    key: string,
    hit?: boolean,
    details?: any
  ): void {
    this.debug(
      AuditLogCategory.CACHE,
      `Cache ${operation}: ${cacheType}[${key}]`,
      {
        details: { operation, cacheType, key, hit, ...details },
      }
    );
  }

  /**
   * Create a correlation ID for related log entries
   */
  createCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Time a function and log its execution
   */
  async timeFunction<T>(
    category: AuditLogCategory,
    name: string,
    fn: () => Promise<T> | T,
    details?: Partial<AuditLogEntry>
  ): Promise<T> {
    const start = process.hrtime.bigint();
    const correlationId = this.createCorrelationId();

    this.debug(category, `Starting: ${name}`, { ...details, correlationId });

    try {
      const result = await fn();
      const duration = Number(process.hrtime.bigint() - start) / 1000000; // Convert to milliseconds

      this.info(category, `Completed: ${name}`, {
        ...details,
        correlationId,
        duration,
      });

      return result;
    } catch (error) {
      const duration = Number(process.hrtime.bigint() - start) / 1000000;

      this.error(category, `Failed: ${name}`, error as Error, {
        ...details,
        correlationId,
        duration,
      });

      throw error;
    }
  }

  /**
   * Query audit log entries
   */
  query(query: AuditLogQuery = {}): AuditLogEntry[] {
    let results = [...this.entries];

    // Filter by level
    if (query.level !== undefined) {
      results = results.filter(entry => entry.level >= query.level!);
    }

    // Filter by category
    if (query.category) {
      results = results.filter(entry => entry.category === query.category);
    }

    // Filter by user ID
    if (query.userId) {
      results = results.filter(entry => entry.userId === query.userId);
    }

    // Filter by guild ID
    if (query.guildId) {
      results = results.filter(entry => entry.guildId === query.guildId);
    }

    // Filter by channel ID
    if (query.channelId) {
      results = results.filter(entry => entry.channelId === query.channelId);
    }

    // Filter by time range
    if (query.startTime) {
      results = results.filter(entry => entry.timestamp >= query.startTime!);
    }

    if (query.endTime) {
      results = results.filter(entry => entry.timestamp <= query.endTime!);
    }

    // Filter by correlation ID
    if (query.correlationId) {
      results = results.filter(
        entry => entry.correlationId === query.correlationId
      );
    }

    // Text search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      results = results.filter(
        entry =>
          entry.message.toLowerCase().includes(searchLower) ||
          JSON.stringify(entry.details || {})
            .toLowerCase()
            .includes(searchLower)
      );
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || results.length;

    return results.slice(offset, offset + limit);
  }

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
  } {
    const entriesByLevel: Record<string, number> = {};
    const entriesByCategory: Record<string, number> = {};

    let oldestEntry: number | undefined;
    let newestEntry: number | undefined;

    for (const entry of this.entries) {
      // Count by level
      const levelName = AuditLogLevel[entry.level];
      entriesByLevel[levelName] = (entriesByLevel[levelName] || 0) + 1;

      // Count by category
      entriesByCategory[entry.category] =
        (entriesByCategory[entry.category] || 0) + 1;

      // Track time range
      if (!oldestEntry || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (!newestEntry || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    }

    const timeRangeMs =
      (newestEntry || Date.now()) - (oldestEntry || Date.now());
    const timeRangeDays = timeRangeMs / (24 * 60 * 60 * 1000);
    const avgEntriesPerDay =
      timeRangeDays > 0 ? this.entries.length / timeRangeDays : 0;

    return {
      totalEntries: this.entries.length,
      entriesByLevel,
      entriesByCategory,
      oldestEntry,
      newestEntry,
      avgEntriesPerDay,
    };
  }

  /**
   * Export audit logs in various formats
   */
  export(
    format: "json" | "csv" | "tsv" = "json",
    query?: AuditLogQuery
  ): string {
    const entries = query ? this.query(query) : this.entries;

    switch (format) {
      case "json":
        return JSON.stringify(entries, null, 2);

      case "csv":
        return this.exportCsv(entries, ",");

      case "tsv":
        return this.exportCsv(entries, "\t");

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Clear old entries based on retention policy
   */
  cleanup(): void {
    const cutoffTime =
      Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000;
    const initialLength = this.entries.length;

    // Remove old entries
    for (let i = this.entries.length - 1; i >= 0; i--) {
      if (this.entries[i].timestamp < cutoffTime) {
        this.entries.splice(i, 1);
      }
    }

    // Trim to max size if needed
    if (this.entries.length > this.config.maxEntries) {
      this.entries.splice(0, this.entries.length - this.config.maxEntries);
    }

    const removedCount = initialLength - this.entries.length;
    if (removedCount > 0) {
      this.info(
        AuditLogCategory.SYSTEM,
        `Cleaned up ${removedCount} old audit log entries`
      );
    }
  }

  /**
   * Get recent entries by level
   */
  getRecentErrors(hours = 24): AuditLogEntry[] {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    return this.query({
      level: AuditLogLevel.ERROR,
      startTime: cutoffTime,
    });
  }

  /**
   * Get entries for a specific user
   */
  getUserActivity(userId: string, hours = 24): AuditLogEntry[] {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    return this.query({
      userId,
      startTime: cutoffTime,
    });
  }

  /**
   * Get entries for a specific guild
   */
  getGuildActivity(guildId: string, hours = 24): AuditLogEntry[] {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000;
    return this.query({
      guildId,
      startTime: cutoffTime,
    });
  }

  /**
   * Destroy the logger and cleanup resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
    this.entries.length = 0;
  }

  /**
   * Core logging method
   */
  private log(
    level: AuditLogLevel,
    category: AuditLogCategory,
    message: string,
    details?: Partial<AuditLogEntry>
  ): void {
    // Check if logging is enabled for this level and category
    if (
      level < this.config.minLevel ||
      !this.config.enabledCategories.includes(category)
    ) {
      return;
    }

    const entry: AuditLogEntry = {
      id: (++this.entryIdCounter).toString(),
      timestamp: Date.now(),
      level,
      category,
      message,
      ...details,
    };

    this.entries.push(entry);

    // Trim if over max size
    if (this.entries.length > this.config.maxEntries) {
      this.entries.shift();
    }

    // Also log to console for immediate visibility
    const levelName = AuditLogLevel[level];
    const timestamp = new Date(entry.timestamp).toISOString();
    console.log(
      `[${timestamp}] ${levelName} [${category}] ${message}`,
      details || ""
    );
  }

  /**
   * Export entries as CSV/TSV
   */
  private exportCsv(entries: AuditLogEntry[], delimiter: string): string {
    if (entries.length === 0) {
      return "";
    }

    const headers = [
      "id",
      "timestamp",
      "level",
      "category",
      "message",
      "userId",
      "guildId",
      "channelId",
      "sourceIp",
      "correlationId",
      "duration",
      "details",
    ];

    const rows = entries.map(entry => [
      entry.id,
      entry.timestamp,
      AuditLogLevel[entry.level],
      entry.category,
      `"${entry.message.replace(/"/g, '""')}"`,
      entry.userId || "",
      entry.guildId || "",
      entry.channelId || "",
      entry.sourceIp || "",
      entry.correlationId || "",
      entry.duration || "",
      entry.details
        ? `"${JSON.stringify(entry.details).replace(/"/g, '""')}"`
        : "",
    ]);

    return [
      headers.join(delimiter),
      ...rows.map(row => row.join(delimiter)),
    ].join("\n");
  }

  /**
   * Start automatic cleanup
   */
  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.cleanup();
    }, this.config.flushInterval);
  }
}
