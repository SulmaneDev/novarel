import type { Abstract } from './abstract.interface.js';

/**
 * GlobalCallback interface that represents a global callback.
 * @template T The type of the class being constructed.
 */
export interface GlobalCallback<T = any> {
  (abstract: Abstract<T>): void;
}
