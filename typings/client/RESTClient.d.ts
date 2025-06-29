/**
 * Options for configuring the RESTClient.
 */
export interface RESTOptions {
    /** Bot token for authentication */
    token: string;
    /** Discord API version (default: 10) */
    version?: number;
    /** Base URL for the Discord API (default: https://discord.com/api/v{version}) */
    baseURL?: string;
}
/**
 * Represents an error returned by the Discord REST API.
 */
export declare class RESTError extends Error {
    /** HTTP status code */
    status: number;
    /** Error response data */
    response: any;
    constructor(status: number, message: string, response?: any);
}
/**
 * A client for interacting with the Discord REST API.
 * Handles requests, error handling, and basic rate limiting.
 */
export declare class RESTClient {
    /** Bot token for authentication */
    token: string;
    /** Discord API version */
    version: number;
    /** Base URL for the Discord API */
    baseURL: string;
    private rateLimits;
    /**
     * Create a new RESTClient instance.
     * @param options Configuration options for the REST client
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
     * Make a DELETE request to the Discord API.
     * @param endpoint API endpoint
     * @param extraHeaders Additional headers (optional)
     */
    delete<T = any>(endpoint: string, extraHeaders?: Record<string, string>): Promise<T>;
}
//# sourceMappingURL=RESTClient.d.ts.map