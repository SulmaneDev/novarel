import { type Request } from 'express';

/**
 * NovarelRequest wraps an Express Request instance to provide a Laravel-like fluent API.
 * @class
 */
export class NovarelRequest {
    /**
     * Creates an instance of NovarelRequest.
     * @param {Request} requestInit - The Express Request object to wrap.
     */
    constructor(public requestInit: Request) {}

    /**
     * Gets a route parameter by name, with an optional default value.
     * @param {string} name - The name of the route parameter.
     * @param {T} [defaultValue] - The default value if the parameter is not found.
     * @returns {T} The parameter value or the default value.
     * @template T - The type of the parameter value.
     * @example
     * const id = request.param('id', '1'); // Returns '1' if id is not found
     */
    param<T = any>(name: string, defaultValue?: T): T {
        return (this.requestInit.params[name] as T) ?? defaultValue!;
    }

    /**
     * Gets a query string parameter by name, with an optional default value.
     * @param {string} name - The name of the query parameter.
     * @param {T} [defaultValue] - The default value if the parameter is not found.
     * @returns {T} The query parameter value or the default value.
     * @template T - The type of the query parameter value.
     * @example
     * const page = request.query('page', 1); // Returns 1 if page is not found
     */
    query<T = any>(name: string, defaultValue?: T): T {
        return (this.requestInit.query[name] as T) ?? defaultValue!;
    }

    /**
     * Gets the entire parsed request body.
     * @returns {T} The request body as an object.
     * @template T - The type of the request body.
     * @example
     * const body = request.all(); // Returns { name: 'John', age: 30 }
     */
    all<T = Record<string, any>>(): T {
        return this.requestInit.body as T;
    }

    /**
     * Gets a specific value from the request body, with an optional default value.
     * @param {string} name - The name of the body field.
     * @param {T} [defaultValue] - The default value if the field is not found.
     * @returns {T} The body field value or the default value.
     * @template T - The type of the body field value.
     * @example
     * const name = request.input('name', 'Guest'); // Returns 'Guest' if name is not found
     */
    input<T = any>(name: string, defaultValue?: T): T {
        return (this.requestInit.body[name] as T) ?? defaultValue!;
    }

    /**
     * Gets body fields excluding the specified keys.
     * @param {...string[]} names - The names of fields to exclude.
     * @returns {T} The filtered body object.
     * @template T - The type of the filtered body object.
     * @example
     * const body = request.except('password', '_token'); // Excludes password and _token
     */
    except<T = Record<string, any>>(...names: string[]): T {
        const body = { ...this.requestInit.body };
        for (const name of names) delete body[name];
        return body as T;
    }

    /**
     * Gets only the specified body fields.
     * @param {...string[]} names - The names of fields to include.
     * @returns {T} The filtered body object with only the specified fields.
     * @template T - The type of the filtered body object.
     * @example
     * const body = request.only('name', 'email'); // Includes only name and email
     */
    only<T = Record<string, any>>(...names: string[]): T {
        const body: Record<string, any> = {};
        for (const name of names) {
            if (name in this.requestInit.body) {
                body[name] = this.requestInit.body[name];
            }
        }
        return body as T;
    }

    /**
     * Checks if a request body field exists.
     * @param {string} name - The name of the field to check.
     * @returns {boolean} True if the field exists, false otherwise.
     * @example
     * if (request.has('email')) console.log('Email field exists');
     */
    has(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.requestInit.body, name);
    }

    /**
     * Checks if a request body field is non-empty.
     * @param {string} name - The name of the field to check.
     * @returns {boolean} True if the field exists and is non-empty, false otherwise.
     * @example
     * if (request.filled('username')) console.log('Username is filled');
     */
    filled(name: string): boolean {
        const value = this.requestInit.body[name];
        return value !== undefined && value !== null && value !== '';
    }

    /**
     * Converts a body field to a boolean value.
     * @param {string} name - The name of the field to convert.
     * @returns {boolean} The boolean representation of the field value.
     * @example
     * const isActive = request.boolean('isActive'); // Returns true for 'true', 1, etc.
     */
    boolean(name: string): boolean {
        const value = this.requestInit.body[name];
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') return value.toLowerCase() === 'true';
        return Boolean(value);
    }

    /**
     * Gets the HTTP method of the request.
     * @returns {string} The HTTP method (e.g., GET, POST).
     * @example
     * const method = request.method(); // Returns 'POST'
     */
    method(): string {
        return this.requestInit.method;
    }

    /**
     * Checks if the request method matches the specified method.
     * @param {string} method - The HTTP method to check against (case-insensitive).
     * @returns {boolean} True if the method matches, false otherwise.
     * @example
     * if (request.isMethod('POST')) console.log('Request is POST');
     */
    isMethod(method: string): boolean {
        return this.requestInit.method.toLowerCase() === method.toLowerCase();
    }

    /**
     * Gets the request path without query parameters.
     * @returns {string} The request path.
     * @example
     * const path = request.path(); // Returns '/users'
     */
    path(): string {
        return this.requestInit.path;
    }

    /**
     * Gets the request URL without the host.
     * @returns {string} The request URL.
     * @example
     * const url = request.url(); // Returns '/users?sort=asc'
     */
    url(): string {
        return this.requestInit.url;
    }

    /**
     * Gets the full URL including protocol and host.
     * @returns {string} The full URL.
     * @example
     * const fullUrl = request.fullUrl(); // Returns 'https://example.com/users'
     */
    fullUrl(): string {
        const host = this.requestInit.get('host') ?? '';
        return `${this.requestInit.protocol}://${host}${this.requestInit.originalUrl}`;
    }

    /**
     * Gets the requester's IP address.
     * @returns {string} The IP address, or an empty string if not available.
     * @example
     * const ip = request.ip(); // Returns '192.168.1.1'
     */
    ip(): string {
        return this.requestInit.ip ?? '';
    }

    /**
     * Gets the IP address chain if proxy is enabled.
     * @returns {string[]} The array of IP addresses, or an empty array if not available.
     * @example
     * const ips = request.ips(); // Returns ['192.168.1.1', '10.0.0.1']
     */
    ips(): string[] {
        return this.requestInit.ips ?? [];
    }

    /**
     * Checks if the request is an AJAX request.
     * @returns {boolean} True if the request is AJAX, false otherwise.
     * @example
     * if (request.ajax()) console.log('AJAX request detected');
     */
    ajax(): boolean {
        return this.requestInit.xhr === true;
    }

    /**
     * Checks if the request is a PJAX request.
     * @returns {boolean} True if the request has an X-PJAX header, false otherwise.
     * @example
     * if (request.isPjax()) console.log('PJAX request detected');
     */
    isPjax(): boolean {
        return this.getHeader('X-PJAX') !== undefined;
    }

    /**
     * Gets the value of a request header (case-insensitive).
     * @param {string} name - The name of the header.
     * @returns {string | undefined} The header value, or undefined if not found.
     * @example
     * const accept = request.getHeader('Accept'); // Returns 'application/json'
     */
    getHeader(name: string): string | undefined {
        return this.requestInit.get(name);
    }

    /**
     * Checks if a request header exists.
     * @param {string} name - The name of the header.
     * @returns {boolean} True if the header exists, false otherwise.
     * @example
     * if (request.hasHeader('Authorization')) console.log('Authorization header exists');
     */
    hasHeader(name: string): boolean {
        return this.getHeader(name) !== undefined;
    }

    /**
     * Extracts the Bearer token from the Authorization header.
     * @returns {string} The Bearer token, or an empty string if not found.
     * @example
     * const token = request.bearerToken(); // Returns 'abc123' from 'Bearer abc123'
     */
    bearerToken(): string {
        const auth = this.getHeader('Authorization');
        return auth?.startsWith('Bearer ') ? auth.slice(7) : '';
    }

    /**
     * Gets the value of a cookie.
     * @param {string} key - The name of the cookie.
     * @returns {string} The cookie value, or an empty string if not found.
     * @example
     * const session = request.cookie('session'); // Returns 'abc123'
     */
    cookie(key: string): string {
        return this.requestInit.cookies?.[key] ?? '';
    }

    /**
     * Gets all signed (verified) cookies.
     * @returns {Record<string, string>} An object containing signed cookies.
     * @example
     * const signed = request.trustedCookies(); // Returns { session: 'abc123' }
     */
    trustedCookies(): Record<string, string> {
        return this.requestInit.signedCookies ?? {};
    }

    /**
     * Gets the route metadata if the request matched a route.
     * @returns {any} The route metadata, or undefined if not available.
     * @example
     * const route = request.route(); // Returns route metadata
     */
    route(): any {
        return this.requestInit.route;
    }

    /**
     * Checks if the request is secure (HTTPS).
     * @returns {boolean} True if the request is secure, false otherwise.
     * @example
     * if (request.secure()) console.log('Request is secure');
     */
    secure(): boolean {
        return this.requestInit.secure === true;
    }

    /**
     * Checks if the request accepts a specific content type.
     * @param {string} type - The MIME type to check (e.g., 'application/json').
     * @returns {string | false} The matched type if accepted, false otherwise.
     * @example
     * const acceptsJson = request.accepts('application/json'); // Returns 'application/json' or false
     */
    accepts(type: string): string | false {
        return this.requestInit.accepts(type);
    }

    /**
     * Gets the request protocol (http or https).
     * @returns {string} The protocol.
     * @example
     * const protocol = request.protocol(); // Returns 'https'
     */
    protocol(): string {
        return this.requestInit.protocol;
    }

    /**
     * Gets the hostname of the request (without port).
     * @returns {string} The hostname.
     * @example
     * const hostname = request.hostname(); // Returns 'example.com'
     */
    hostname(): string {
        return this.requestInit.hostname;
    }

    /**
     * Gets the base URL of the route.
     * @returns {string} The base URL.
     * @example
     * const baseUrl = request.baseUrl(); // Returns '/api'
     */
    baseUrl(): string {
        return this.requestInit.baseUrl;
    }

    /**
     * Checks if the request Content-Type matches the specified type.
     * @param {string} type - The MIME type to check (e.g., 'application/json').
     * @returns {string | false | null} The matched type, false if not matched, or null if no Content-Type.
     * @example
     * const isJson = request.is('application/json'); // Returns 'application/json' or false
     */
    is(type: string): string | false | null {
        return this.requestInit.is(type);
    }

    /**
     * Gets the Accept header to check if the client wants JSON.
     * @returns {string | undefined} The Accept header value, or undefined if not set.
     * @example
     * const accept = request.wantsJson(); // Returns 'application/json' or undefined
     */
    wantsJson(): string | undefined {
        return this.getHeader('Accept');
    }
}
