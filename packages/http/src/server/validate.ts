import type { NovarelRequest } from './request.js';
import { z } from 'zod';
/**
 * Type definition for a validation rule.
 * A rule can be either a function that validates an attribute and calls `fail` with an error message,
 * or a string representing a predefined validation rule.
 */
export type Rule = ReturnType<typeof z.object>;

/**
 * Abstract base class for validation logic.
 * Classes extending this class must implement methods to authorize requests and define validation rules.
 */
export abstract class Validate {
    /**
     * Constructs a validator with the given request object.
     * @param request - The custom Novarel request object containing request data.
     */
    constructor(protected request: NovarelRequest) {}

    /**
     * Determines if the request is authorized to proceed with validation.
     * @returns `true` if the request is authorized, `false` otherwise.
     */
    public abstract authorize(): boolean;

    /**
     * Defines the validation rules for request attributes.
     * @returns A record mapping attribute names to a single rule or an array of rules.
     */
    public abstract rules(): Rule;
}


