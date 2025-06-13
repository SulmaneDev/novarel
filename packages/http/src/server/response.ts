import { promisify } from 'util';
import { STATUS_ENUM } from '../enums/status.js';
import { type CookieOptions, type Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { stat } from 'fs/promises';

/**
 * A wrapper class for Express Response to provide a fluent API for HTTP responses.
 * @class
 */
export class NovarelResponse {
    /**
     * Creates an instance of NovarelResponse.
     * @param {Response} responseInit - The Express Response object to wrap.
     */
    constructor(public responseInit: Response) {}

    /**
     * Sets the HTTP status code for the response.
     * @param {number | keyof typeof STATUS_ENUM} code - The HTTP status code or a key from STATUS_ENUM.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.status(200); // Sets status to 200 OK
     * response.status('OK'); // Sets status to 200 OK using STATUS_ENUM
     */
    status(code: number | keyof typeof STATUS_ENUM): this {
        const s_code = typeof code === 'number' ? code : STATUS_ENUM[code];
        this.responseInit.status(s_code);
        return this;
    }

    /**
     * Sends a response body to the client.
     * @param {any} [body] - The response body to send (e.g., string, object, Buffer).
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.send('Hello, World!'); // Sends a plain text response
     */
    send(body?: any): this {
        this.responseInit.send(body);
        return this;
    }

    /**
     * Sends a JSON response to the client.
     * @param {any} [body] - The JSON-serializable object to send.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.json({ message: 'Success' }); // Sends a JSON response
     */
    json(body?: any): this {
        this.responseInit.json(body);
        return this;
    }

    /**
     * Sets an HTTP header for the response.
     * @param {string} name - The name of the header.
     * @param {string | number | readonly string[]} value - The value of the header.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.setHeader('X-Custom-Header', 'value'); // Sets a custom header
     */
    setHeader(name: string, value: string | number | readonly string[]): this {
        this.responseInit.setHeader(name, value);
        return this;
    }

    /**
     * Gets the value of an HTTP header.
     * @param {string} name - The name of the header to retrieve.
     * @returns {string | string[] | undefined} The header value, if set.
     * @example
     * const value = response.getHeader('Content-Type'); // Retrieves the Content-Type header
     */
    getHeader(name: string): string | string[] | number | undefined {
        return this.responseInit.getHeader(name);
    }

    /**
     * Sets the Content-Type header for the response.
     * @param {string} [type='application/json'] - The MIME type for the response.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.contentType('text/html'); // Sets Content-Type to text/html
     */
    contentType(type: string = 'application/json'): this {
        this.setHeader('Content-Type', type);
        return this;
    }

    /**
     * Redirects the client to a specified URL.
     * @param {string} url - The URL to redirect to.
     * @param {number | keyof typeof STATUS_ENUM} [code=302] - The HTTP status code for the redirect.
     * @returns {Response} The Express Response object.
     * @example
     * response.redirect('/home', 301); // Redirects to /home with 301 status
     */
    redirect(url: string, code: number | keyof typeof STATUS_ENUM = 302): void {
        return this.responseInit
            .status(typeof code == 'string' ? STATUS_ENUM[code] : code)
            .redirect(url);
    }

    /**
     * Sets the Location header for the response.
     * @param {string} url - The URL to set in the Location header.
     * @returns {Response} The Express Response object.
     * @example
     * response.location('/new-url'); // Sets Location header to /new-url
     */
    location(url: string): Response {
        return this.responseInit.location(url);
    }

    /**
     * Sets a cookie in the response.
     * @param {string} name - The name of the cookie.
     * @param {string} value - The value of the cookie.
     * @param {CookieOptions} options - Cookie configuration options (e.g., maxAge, httpOnly).
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.cookie('session', 'abc123', { maxAge: 3600000, httpOnly: true });
     */
    cookie(name: string, value: string, options: CookieOptions): this {
        this.responseInit.cookie(name, value, options);
        return this;
    }

    /**
     * Clears a cookie from the client.
     * @param {string} name - The name of the cookie to clear.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.deleteCookie('session'); // Clears the 'session' cookie
     */
    deleteCookie(name: string): this {
        this.responseInit.clearCookie(name);
        return this;
    }

    /**
     * Serves a file to the client.
     * @param {string} path - The file path to serve.
     * @returns {Promise<this>} A promise resolving to the NovarelResponse instance for chaining.
     * @example
     * await response.serveFile('./public/index.html'); // Serves index.html
     */
    async serveFile(path: string): Promise<this> {
        await promisify(this.responseInit.sendFile)(path);
        return this;
    }

    /**
     * Initiates a file download in the client.
     * @param {string} path - The file path to download.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.download('./files/report.pdf'); // Triggers download of report.pdf
     */
    download(path: string): this {
        this.responseInit.download(path);
        return this;
    }

    /**
     * Appends a value to an existing HTTP header.
     * @param {string} name - The name of the header.
     * @param {string} value - The value to append.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.append('Link', '<http://example.com>; rel=preload');
     */
    append(name: string, value: string): this {
        this.responseInit.append(name, value);
        return this;
    }

    /**
     * Renders a view template with provided data.
     * @param {string} name - The name of the view template to render.
     * @param {Record<string, any>} [data={ user: {}, routes: {}, session: {} }] - Data to pass to the template.
     * @returns {this} The NovarelResponse instance for chaining.
     * @example
     * response.view('index', { user: { name: 'John' } }); // Renders index template
     */
    view(name: string, data: Record<string, any> = { user: {}, routes: {}, session: {} }): this {
        this.responseInit.render(name, data);
        return this;
    }
    /**
     * Streams a file to the response.
     * @param filePath - The path to the file to be streamed.
     * @param contentType - The MIME type of the file. Defaults to 'application/octet-stream' if not provided.
     * @returns A promise resolving to the NovarelResponse instance for method chaining.
     * @throws Sets a 404 status and sends 'File not found' if the file does not exist.
     * @example
     * ```typescript
     * await response.stream('./files/video.mp4', 'video/mp4'); // Streams a video file
     * ```
     */
    async stream(filePath: string, contentType?: string) {
        if (!existsSync(filePath)) {
            this.status(STATUS_ENUM.NOT_FOUND).send('File not found');
            return this;
        }
        const fileStat = await stat(filePath);
        this.setHeader('Content-Length', fileStat.size);
        this.setHeader('Content-Type', contentType || 'application/octet-stream');
        const stream = createReadStream(filePath);
        stream.pipe(this.responseInit);
        return this;
    }
}
