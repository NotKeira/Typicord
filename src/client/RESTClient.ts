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
export class RESTError extends Error {
  /** The HTTP status code (404, 403, etc.) */
  status: number;
  /** Whatever Discord sent back as the error response */
  response: any;
  constructor(status: number, message: string, response?: any) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

import { fetch as undiciFetch, Agent } from "undici";

/**
 * Handles making HTTP requests to Discord's REST API
 * Deals with rate limiting, error handling, and all that fun stuff
 * so you don't have to worry about it
 */
export type APILatencyCallback = (
  latencyMs: number,
  method: string,
  endpoint: string
) => void;

export class RESTClient {
  /** Your bot's token */
  public token: string;
  /** Which Discord API version we're using */
  public version: number;
  /** The base URL for Discord's API */
  public baseURL: string;
  /** Reusable HTTP agent for connection pooling and better performance */
  private agent: Agent;
  private rateLimits: Map<string, number> = new Map();
  /** Optional callback to track how long API requests take */
  public onAPILatency?: APILatencyCallback;

  /**
   * Creates a new REST client for talking to Discord's API
   * @param options Configuration - at minimum you need a token
   */
  constructor(options: RESTOptions) {
    this.token = options.token;
    this.version = options.version ?? 10;
    this.baseURL =
      options.baseURL ?? `https://discord.com/api/v${this.version}`;
    
    // Create a persistent agent for connection pooling
    this.agent = new Agent({
      keepAliveTimeout: 10000, // 10 seconds
      keepAliveMaxTimeout: 30000, // 30 seconds
      maxCachedSessions: 100, // cache up to 100 TLS sessions
    });
  }

  /**
   * Handles rate limit responses and waits if necessary.
   * @param endpoint The endpoint being requested
   * @param res The fetch Response object
   * @returns True if rate limited and retried, false otherwise
   */
  private async handleRateLimit(endpoint: string, res: any) {
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after")) || 1;
      this.rateLimits.set(endpoint, Date.now() + retryAfter * 1000);
      console.warn(
        `[REST] Rate limited on ${endpoint}, retrying after ${retryAfter}s`
      );
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return true;
    }
    return false;
  }

  /**
   * Checks if the endpoint is currently rate limited.
   * @param endpoint The endpoint to check
   * @returns True if rate limited, false otherwise
   */
  private isRateLimited(endpoint: string) {
    const until = this.rateLimits.get(endpoint);
    return until && Date.now() < until;
  }

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
  async request<T = any>(
    method: string,
    endpoint: string,
    body?: any,
    extraHeaders?: Record<string, string>,
    isForm?: boolean
  ): Promise<T> {
    if (this.isRateLimited(endpoint)) {
      throw new RESTError(429, `Rate limited for endpoint: ${endpoint}`);
    }
    const url = `${this.baseURL}${endpoint}`;
    let headers: Record<string, string> = {
      Authorization: `Bot ${this.token}`,
      "User-Agent": `DiscordBot (https://git.keira.boo/Typicord, ${
        process.env.npm_package_version || this.version || "1.0.0"
      }) Node.js/${process.version}`,
      ...extraHeaders,
    };
    let payload: any = undefined;
    if (body) {
      if (isForm) {
        // Assume body is FormData
        payload = body;
      } else {
        headers["Content-Type"] = "application/json";
        payload = JSON.stringify(body);
      }
    }
    const start = Date.now();
    const res = await undiciFetch(url, {
      method,
      headers,
      body: payload,
      dispatcher: this.agent, // Use our persistent agent
    });
    const latency = Date.now() - start;
    if (this.onAPILatency) this.onAPILatency(latency, method, endpoint);
    if (await this.handleRateLimit(endpoint, res)) {
      return this.request(method, endpoint, body, extraHeaders, isForm);
    }
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = await res.text();
      }
      throw new RESTError(
        res.status,
        `REST Error ${res.status}: ${res.statusText}`,
        errorData
      );
    }
    // Handle empty response (e.g., 204 No Content)
    const contentType = res.headers.get("content-type");
    if (
      res.status === 204 ||
      !contentType ||
      contentType.indexOf("application/json") === -1
    ) {
      return undefined as T;
    }
    return res.json() as Promise<T>;
  }

  /**
   * Make a GET request to the Discord API.
   * @param endpoint API endpoint
   * @param extraHeaders Additional headers (optional)
   */
  get<T = any>(endpoint: string, extraHeaders?: Record<string, string>) {
    return this.request<T>("GET", endpoint, undefined, extraHeaders);
  }

  /**
   * Make a POST request to the Discord API.
   * @param endpoint API endpoint
   * @param body Request body (optional)
   * @param extraHeaders Additional headers (optional)
   * @param isForm Whether the body is FormData (optional)
   */
  post<T = any>(
    endpoint: string,
    body?: any,
    extraHeaders?: Record<string, string>,
    isForm?: boolean
  ) {
    return this.request<T>("POST", endpoint, body, extraHeaders, isForm);
  }

  /**
   * Make a PATCH request to the Discord API.
   * @param endpoint API endpoint
   * @param body Request body (optional)
   * @param extraHeaders Additional headers (optional)
   * @param isForm Whether the body is FormData (optional)
   */
  patch<T = any>(
    endpoint: string,
    body?: any,
    extraHeaders?: Record<string, string>,
    isForm?: boolean
  ) {
    return this.request<T>("PATCH", endpoint, body, extraHeaders, isForm);
  }

  /**
   * Make a PUT request to the Discord API.
   * @param endpoint API endpoint
   * @param body Request body (optional)
   * @param extraHeaders Additional headers (optional)
   * @param isForm Whether the body is FormData (optional)
   */
  put<T = any>(
    endpoint: string,
    body?: any,
    extraHeaders?: Record<string, string>,
    isForm?: boolean
  ) {
    return this.request<T>("PUT", endpoint, body, extraHeaders, isForm);
  }

  /**
   * Clean up the REST client and close any open connections
   * Call this when you're done with the client to free up resources
   */
  destroy() {
    this.agent.destroy();
  }

  /**
   * Make a DELETE request to the Discord API.
   * @param endpoint API endpoint
   * @param extraHeaders Additional headers (optional)
   */
  delete<T = any>(endpoint: string, extraHeaders?: Record<string, string>) {
    return this.request<T>("DELETE", endpoint, undefined, extraHeaders);
  }
}
