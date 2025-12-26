import type { Abstract } from './abstract.interface.js';
import type { ExtendsContainer } from './container.interface.js';

/**
 * Extender interface that represents an extender.
 * @template T The type of the class being extended.
 * @template App The type of the application being extended.
 * @returns {T}
 */
export interface Extender<T, App = ExtendsContainer> {
  (instance: T, application: App): T;
}


/**
 * ExtenderMap interface that represents a map of extenders.
 */
export type ExtenderMap = Map<Abstract, Extender<any>[]>;