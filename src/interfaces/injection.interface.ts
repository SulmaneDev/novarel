import type { Abstract } from './abstract.interface.js';

/**
 * Injection interface that represents an injection.
 * @template T The type of the class being injected.
 */
export type InjectionInterface<T = any> = Abstract<T> | (() => Abstract<T>);
