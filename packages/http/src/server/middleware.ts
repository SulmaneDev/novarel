import type { NextFunction } from 'express';
import type { NovarelRequest } from './request.js';
import type { NovarelResponse } from './response.js';

/**
 * Abstract base class for Novarel middleware.
 * Middleware classes extending this class must implement the `handle` method
 * to process incoming requests and pass control to the next middleware or route handler.
 */
export abstract class NovarelMiddleware {
    /**
     * Handles the incoming request and determines the response or passes control to the next middleware.
     * @param req - The custom Novarel request object, extending Express's request.
     * @param next - The Express next function to pass control to the next middleware or route handler.
     * @returns A Novarel response object or void if control is passed to the next middleware.
     */
    abstract handle(
        req: NovarelRequest,
        res: NovarelResponse,
        next: NextFunction,
    ): void | Promise<void>;
}
