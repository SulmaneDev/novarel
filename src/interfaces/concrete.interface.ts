import type { Abstract } from "./abstract.interface.js";

/**
 * Concrete interface that represents a concrete class.
 * @template T The type of the class being constructed.
 */
export type Concrete<T=any> = Abstract<T> | T;