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
export class RESTError extends Error {
  /** HTTP status code */
  public status: number;
  /** Error response data */
  public response: any;
  constructor(status: number, message: string, response?: any) {
    super(message);
    this.status = status;
    this.response = response;
  }
}

/**
 * A client for interacting with the Discord REST API.
 * Handles requests, error handling, and basic rate limiting.
 */
export class RESTClient {
  /** Bot token for authentication */
  public token: string;
  /** Discord API version */
  public version: number;
  /** Base URL for the Discord API */
  public baseURL: string;
  private rateLimits: Map<string, number> = new Map();

  /**
   * Create a new RESTClient instance.
   * @param options Configuration options for the REST client
   */
  constructor(options: RESTOptions) {
    this.token = options.token;
    this.version = options.version ?? 10;
    this.baseURL =
      options.baseURL ?? `https://discord.com/api/v${this.version}`;
  }

  /**
   * Handles rate limit responses and waits if necessary.
   * @param endpoint The endpoint being requested
   * @param res The fetch Response object
   * @returns True if rate limited and retried, false otherwise
   */
  private async handleRateLimit(endpoint: string, res: Response) {
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after")) || 1;
      this.rateLimits.set(endpoint, Date.now() + retryAfter * 1000);
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
    const res = await fetch(url, {
      method,
      headers,
      body: payload,
    });
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
    return res.json();
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
   * Make a DELETE request to the Discord API.
   * @param endpoint API endpoint
   * @param extraHeaders Additional headers (optional)
   */
  delete<T = any>(endpoint: string, extraHeaders?: Record<string, string>) {
    return this.request<T>("DELETE", endpoint, undefined, extraHeaders);
  }
}
