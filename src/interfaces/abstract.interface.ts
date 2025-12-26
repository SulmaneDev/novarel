import type { Constructor } from './constructor.interface.js';
import type { Factory } from './factory.interface.js';
import type { Name } from './name.interface.js';

/**
 * Abstract interface that represents an abstract class.
 * @template T The type of the class being constructed.
 */
export type Abstract<T = any> = Constructor<T> | Factory<T> | Name;

/**
 * Abstracts interface that represents an array of abstract classes.
 */
export type Abstracts = Abstract[];