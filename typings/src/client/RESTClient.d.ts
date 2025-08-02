/**
 * What you need to configure the REST client
 */
export interface RESTOptions {
    /** Your bot's token from Discord */
    token: string;
    /** Which API version to use (default: 10, which is the latest stable) */
    version?: number;
    /** Custom API base URL if you need it (probably don't) */
    baseURL?: string;
}
/**
 * When Discord's API returns an error, we wrap it in this
 */
export declare class RESTError extends Error {
    /** The HTTP status code (404, 403, etc.) */
    status: number;
    /** Whatever Discord sent back as the error response */
    response: any;
    constructor(status: number, message: string, response?: any);
}
/**
 * Handles making HTTP requests to Discord's REST API
 * Deals with rate limiting, error handling, and all that fun stuff
 * so you don't have to worry about it
 */
export type APILatencyCallback = (latencyMs: number, method: string, endpoint: string) => void;
export declare class RESTClient {
    /** Your bot's token */
    token: string;
    /** Which Discord API version we're using */
    version: number;
    /** The base URL for Discord's API */
    baseURL: string;
    /** Reusable HTTP agent for connection pooling and better performance */
    private readonly agent;
    private readonly rateLimits;
    /** Optional callback to track how long API requests take */
    onAPILatency?: APILatencyCallback;
    /**
     * Creates a new REST client for talking to Discord's API
     * @param options Configuration - at minimum you need a token
     */
    constructor(options: RESTOptions);
    /**
     * Handles rate limit responses and waits if necessary.
     * @param endpoint The endpoint being requested
     * @param res The fetch Response object
     * @returns True if rate limited and retried, false otherwise
     */
    private handleRateLimit;
    /**
     * Checks if the endpoint is currently rate limited.
     * @param endpoint The endpoint to check
     * @returns True if rate limited, false otherwise
     */
    private isRateLimited;
    /**
     * Make a REST API request.
     * @param method HTTP method (GET, POST, etc.)
     * @param endpoint API endpoint (e.g., /channels/:id/messages)
     * @param body Request body (optional)
     * @param extraHeaders Additional headers (optional)
     * @param isForm Whether the body is FormData (optional)
     * @returns The parsed JSON response
     * @throws RESTError on HTTP error or rate limit
     */
    request<T = any>(method: string, endpoint: string, body?: any, extraHeaders?: Record<string, string>, isForm?: boolean): Promise<T>;
    /**
     * Make a GET request to the Discord API.
     * @param endpoint API endpoint
     * @param extraHeaders Additional headers (optional)
     */
    get<T = any>(endpoint: string, extraHeaders?: Record<string, string>): Promise<T>;
    /**
     * Make a POST request to the Discord API.
     * @param endpoint API endpoint
     * @param body Request body (optional)
     * @param extraHeaders Additional headers (optional)
     * @param isForm Whether the body is FormData (optional)
     */
    post<T = any>(endpoint: string, body?: any, extraHeaders?: Record<string, string>, isForm?: boolean): Promise<T>;
    /**
     * Make a PATCH request to the Discord API.
     * @param endpoint API endpoint
     * @param body Request body (optional)
     * @param extraHeaders Additional headers (optional)
     * @param isForm Whether the body is FormData (optional)
     */
    patch<T = any>(endpoint: string, body?: any, extraHeaders?: Record<string, string>, isForm?: boolean): Promise<T>;
    /**
     * Make a PUT request to the Discord API.
     * @param endpoint API endpoint
     * @param body Request body (optional)
     * @param extraHeaders Additional headers (optional)
     * @param isForm Whether the body is FormData (optional)
     */
    put<T = any>(endpoint: string, body?: any, extraHeaders?: Record<string, string>, isForm?: boolean): Promise<T>;
    /**
     * Clean up the REST client and close any open connections
     * Call this when you're done with the client to free up resources
     */
    destroy(): void;
    /**
     * Make a DELETE request to the Discord API.
     * @param endpoint API endpoint
     * @param extraHeaders Additional headers (optional)
     */
    delete<T = any>(endpoint: string, extraHeaders?: Record<string, string>): Promise<T>;
}
//# sourceMappingURL=RESTClient.d.ts.map