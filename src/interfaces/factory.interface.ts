import type { ExtendsContainer } from './container.interface.js';

/**
 * Factory interface that represents a factory.
 * @template T The type of the class being constructed.
 */
export interface Factory<T = any, App = ExtendsContainer> {
  (application: ExtendsContainer<App>): T;
}

