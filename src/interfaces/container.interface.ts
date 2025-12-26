import EventEmitter from 'events';
import type { Abstract } from './abstract.interface.js';
import type { Concrete } from './concrete.interface.js';

/**
 * Container interface that represents a container.
 */
export interface ContainerInterface extends EventEmitter {
  /**
   * Resolves an abstract class to a concrete class.
   * @param {Abstract<T>} abstract
   * @returns {T}
   */
  make<T = any>(abstract: Abstract<T>): T;

  /**
   * Binds an abstract class to a concrete class.
   * @param {Abstract<T>} abstract 
   * @param {Concrete<T>} concrete 
   * @param {boolean} shared 
   */
  bind<T = any>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared?: boolean,
  ): void;


  /**
   * Clears the container.
   * @returns {void}
   */
  clear(): void;
}


/**
 * ExtendsContainer interface that extends ContainerInterface.
 * @template T
 * @type {ExtendsContainer<T>}
 * @extends {ContainerInterface}
 */
export type ExtendsContainer<T = ContainerInterface> =
  T extends ContainerInterface ? T : ContainerInterface;

