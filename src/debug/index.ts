/**
 * Typicord Debug System
 *
 * Automatically checks the TYPI_DEBUG environment variable to enable debug logging.
 * Set TYPI_DEBUG=true in your .env file to enable debug output from Typicord.
 */

/**
 * Available debug namespaces for fine-grained control
 */
export enum DebugNamespace {
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
  ALL = "*",
}

/**
 * Debug configuration
 */
interface DebugConfig {
  prefix: string;
  timestamp: boolean;
  stackTrace: boolean;
  namespaces: Set<string>;
}

const debugConfig: DebugConfig = {
  prefix: "[Typicord]",
  timestamp: true,
  stackTrace: true,
  namespaces: new Set([DebugNamespace.ALL]),
};

/**
 * Check if debug is enabled by reading the TYPI_DEBUG environment variable
 */
function isDebugEnabled(namespace?: DebugNamespace): boolean {
  // Check environment variable each time (allows runtime changes)
  const envDebug = process.env.TYPI_DEBUG;
  const debugEnabled = envDebug === "true" || envDebug === "1";

  if (!debugEnabled) return false;

  // If no namespace specified, just check if debug is enabled
  if (!namespace) return true;

  // Check if this specific namespace should be logged
  return (
    debugConfig.namespaces.has(DebugNamespace.ALL) ||
    debugConfig.namespaces.has(namespace)
  );
}

/**
 * Format debug message with timestamp and prefix
 */
function formatMessage(
  namespace: DebugNamespace,
  level: string,
  message: string
): string {
  const timestamp = debugConfig.timestamp
    ? `[${new Date().toISOString()}]`
    : "";
  return `${timestamp}${debugConfig.prefix}[${namespace.toUpperCase()}][${level}] ${message}`;
}

/**
 * Debug logger functions
 */
export const debug = {
  /**
   * Log a debug message
   */
  log(namespace: DebugNamespace, message: string, ...args: any[]): void {
    if (!isDebugEnabled(namespace)) return;
    console.log(formatMessage(namespace, "DEBUG", message), ...args);
  },

  /**
   * Log an info message
   */
  info(namespace: DebugNamespace, message: string, ...args: any[]): void {
    if (!isDebugEnabled(namespace)) return;
    console.info(formatMessage(namespace, "INFO", message), ...args);
  },

  /**
   * Log a warning message
   */
  warn(namespace: DebugNamespace, message: string, ...args: any[]): void {
    if (!isDebugEnabled(namespace)) return;
    console.warn(formatMessage(namespace, "WARN", message), ...args);
  },

  /**
   * Log an error message
   */
  error(
    namespace: DebugNamespace,
    message: string,
    error?: Error,
    ...args: any[]
  ): void {
    if (!isDebugEnabled(namespace)) return;
    console.error(formatMessage(namespace, "ERROR", message), ...args);
    if (error && debugConfig.stackTrace) {
      console.error(error.stack);
    }
  },

  /**
   * Log a trace message (for very verbose debugging)
   */
  trace(namespace: DebugNamespace, message: string, ...args: any[]): void {
    if (!isDebugEnabled(namespace)) return;
    console.trace(formatMessage(namespace, "TRACE", message), ...args);
  },

  /**
   * Log an object/data structure
   */
  data(namespace: DebugNamespace, label: string, data: any): void {
    if (!isDebugEnabled(namespace)) return;
    console.log(formatMessage(namespace, "DATA", label));
    console.dir(data, { depth: 3, colors: true });
  },

  /**
   * Time a function execution
   */
  time<T>(namespace: DebugNamespace, label: string, fn: () => T): T {
    if (!isDebugEnabled(namespace)) return fn();

    const start = performance.now();
    const timerLabel = formatMessage(namespace, "TIMER", label);
    console.time(timerLabel);

    try {
      const result = fn();
      const duration = performance.now() - start;
      console.timeEnd(timerLabel);
      this.log(namespace, `${label} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.timeEnd(timerLabel);
      this.error(
        namespace,
        `${label} failed after ${duration.toFixed(2)}ms`,
        error as Error
      );
      throw error;
    }
  },

  /**
   * Time an async function execution
   */
  async timeAsync<T>(
    namespace: DebugNamespace,
    label: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (!isDebugEnabled(namespace)) return fn();

    const start = performance.now();
    const timerLabel = formatMessage(namespace, "TIMER", label);
    console.time(timerLabel);

    try {
      const result = await fn();
      const duration = performance.now() - start;
      console.timeEnd(timerLabel);
      this.log(namespace, `${label} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.timeEnd(timerLabel);
      this.error(
        namespace,
        `${label} failed after ${duration.toFixed(2)}ms`,
        error as Error
      );
      throw error;
    }
  },
};

/**
 * Configure debug namespaces (optional, defaults to all)
 * @param namespaces Array of namespaces to enable, or 'ALL' for everything
 */
export function configureDebugNamespaces(namespaces: DebugNamespace[]): void {
  debugConfig.namespaces.clear();
  namespaces.forEach(ns => debugConfig.namespaces.add(ns));
}

// Show debug status on first import if enabled
if (isDebugEnabled()) {
  console.log(
    `${debugConfig.prefix} Debug mode enabled via TYPI_DEBUG environment variable`
  );
}
