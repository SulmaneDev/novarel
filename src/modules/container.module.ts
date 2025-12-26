import EventEmitter from 'events';
import type { ContainerInterface } from '../interfaces/container.interface.js';
import {
  Injectable,
  INJECTABLE_KEY,
} from '../decorators/injectable.decorator.js';
import type { ContainerEvent } from '../interfaces/events.interface.js';
import type { BindingInterface } from '../interfaces/binding.interface.js';
import type { Abstract, Abstracts } from '../interfaces/abstract.interface.js';
import type { InstanceBinding } from '../interfaces/instance.interface.js';
import type { GlobalCallback } from '../interfaces/global-callback.interface.js';
import type { Concrete } from '../interfaces/concrete.interface.js';
import type { Constructor } from '../interfaces/constructor.interface.js';
import {
  isUserDefinedClass,
  isUserDefinedFunction,
  toHumanizeName,
} from '../lib/utils.js';
import type { InjectionInterface } from '../interfaces/injection.interface.js';
import { INJECTION_KEY } from '../decorators/injection.decorator.js';
import type { Factory } from '../interfaces/factory.interface.js';
import type {
  Extender,
  ExtenderMap,
} from '../interfaces/extender.interface.js';

/**
 * Container service that handles dependency injection and
 * dependency resolution.
 */
@Injectable()
export class ContainerModule
  extends EventEmitter
  implements ContainerInterface
{
  /**
   * A map of container bindings
   * @type {BindingInterface}
   */
  protected bindings: BindingInterface = new Map();

  /**
   * A stack of abstract classes that are being built
   * @type {Abstracts}
   */
  protected buildStack: Abstracts = [];

  /**
   * An array of singletons that are bound to the container
   * @type {Abstracts}
   */
  protected singletons: Abstracts = [];

  /**
   * An array of resolved abstract classes
   * @type {Abstracts}
   */
  protected resolved: Abstracts = [];

  /**
   * A map of instances that are bound to the container
   * @type {InstanceBinding}
   */
  protected instances: InstanceBinding = new Map();

  /**
   * An array of global before callbacks
   * @type {GlobalCallback[]}
   */
  protected globalBeforeCallbacks: GlobalCallback[] = [];

  /**
   * An array of global after callbacks
   * @type {GlobalCallback[]}
   */
  protected globalAfterCallbacks: GlobalCallback[] = [];

  /**
   * An array of global resolving callbacks
   * @type {GlobalCallback[]}
   */
  protected globalResolving: GlobalCallback[] = [];

  /**
   * Whether or not to fire events
   * @type {boolean}
   */
  protected fireEvents: boolean = true;

  /**
   * A map of extenders
   * @type {ExtenderMap}
   */
  protected extenders: ExtenderMap = new Map();

  /**
   * Emits an event
   * @param {ContainerEvent} eventName
   * @param {any} args
   * @returns {boolean}
   */
  emit(eventName: ContainerEvent, ...args: any[]): boolean {
    if (!this.fireEvents) return false;
    return super.emit(eventName, ...args);
  }

  /**
   * Checks if an abstract is bounded
   * @param {Abstract<T>} abstract
   * @returns {boolean}
   */
  hasBinding<T = any>(abstract: Abstract<T>): boolean {
    return this.bindings.has(abstract);
  }

  /**
   * Checks if an abstract is resolved
   * @param {Abstract<T>} abstract
   * @returns {boolean}
   */
  hasBeenResolved<T = any>(abstract: Abstract<T>): boolean {
    return this.resolved.includes(abstract);
  }

  /**
   * Checks if an abstract is an instance
   * @param {Abstract<T>} abstract
   * @returns {boolean}
   */
  hasInstance<T = any>(abstract: Abstract<T>): boolean {
    return this.instances.has(abstract);
  }

  /**
   * Checks if an abstract is in the build stack
   * @param {Abstract<T>} abstract
   * @returns {boolean}
   */
  inQueue<T = any>(abstract: Abstract<T>): boolean {
    return this.buildStack.includes(abstract);
  }

  /**
   * Registers a binding to the container
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   * @param {boolean} shared
   */
  protected registerBinding<T = any>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared: boolean = false,
  ): void {
    if (concrete === undefined) {
      concrete = abstract as unknown as Concrete<T>;
    }
    this.bindings.set(abstract, concrete);
    if (shared) this.singletons.push(abstract);
    this.emit('bound', abstract, concrete, shared);
  }

  /**
   * Registers a binding to the container
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   * @param {boolean} shared
   */
  bind<T = any>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared?: boolean,
  ): void {
    this.registerBinding(abstract, concrete, shared);
  }

  /**
   * Registers a binding to the container if it doesn't already exist
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   * @param {boolean} shared
   */
  bindIf<T = any>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared?: boolean,
  ): void {
    if (!this.hasBinding(abstract)) {
      this.bind(abstract, concrete, shared);
    }
  }

  /**
   * Registers a singleton to the container
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   */
  singleton<T = any>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
    this.bind(abstract, concrete, true);
  }

  /**
   * Registers a singleton to the container if it doesn't already exist
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   */
  singletonIf<T = any>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
    if (!this.hasBinding(abstract)) {
      this.singleton(abstract, concrete);
    }
  }

  /**
   * Registers an instance to the container
   * @param {Abstract<T>} abstract
   * @param {T} instance
   */
  instance<T = any>(abstract: Abstract<T>, instance: T): void {
    this.instances.set(abstract, instance);
    this.singletons.push(abstract);
    this.resolved.push(abstract);
    this.emit('instance', abstract, instance);
  }

  /**
   * Registers an instance to the container if it doesn't already exist
   * @param {Abstract<T>} abstract
   * @param {T} instance
   */
  instanceIf<T = any>(abstract: Abstract<T>, instance: T): void {
    if (!this.hasInstance(abstract)) {
      this.instance(abstract, instance);
    }
  }

  /**
   * Registers a global before callback
   * @param {GlobalCallback} callback
   */
  before(callback: GlobalCallback): void {
    this.globalBeforeCallbacks.push(callback);
  }

  /**
   * Registers a global after callback
   * @param {GlobalCallback} callback
   */
  after(callback: GlobalCallback): void {
    this.globalAfterCallbacks.push(callback);
  }

  /**
   * Fires global callbacks
   * @param {Abstract<T>} abstract
   * @param {GlobalCallback[]} callbacks
   */
  protected fireCallbacks<T = any>(
    abstract: Abstract<T>,
    callbacks: GlobalCallback[],
  ) {
    for (const callback of callbacks) {
      callback(abstract);
    }
  }

  /**
   * Resolves the dependencies of a constructor
   * @param {Constructor<T>} constructor
   * @returns {T[]}
   */
  protected resolveDependencies<T = any>(constructor: Constructor<T>): T[] {
    if (!Reflect.getMetadata(INJECTABLE_KEY, constructor)) {
      throw new Error(
        `[${toHumanizeName(constructor)}] is not injectable. Did you forget @Injectable()?`,
      );
    }

    const designParams: any[] =
      Reflect.getMetadata('design:paramtypes', constructor) || [];

    const injections: InjectionInterface[] =
      Reflect.getMetadata(INJECTION_KEY, constructor) || [];
    const paramCount = Math.max(designParams.length, injections.length);

    const resolved: T[] = [];
    for (let i = 0; i < paramCount; i++) {
      const customInjection = injections[i];
      const paramType = designParams[i];
      if (customInjection !== undefined) {
        if (
          typeof customInjection === 'function' &&
          !isUserDefinedClass(customInjection)
        ) {
          resolved.push(this.resolve((customInjection as () => any)()));
        } else {
          resolved.push(this.resolve(customInjection));
        }
        continue;
      }

      if (
        paramType !== undefined &&
        paramType !== Object &&
        paramType !== Array
      ) {
        resolved.push(this.resolve(paramType));
        continue;
      }
      throw new Error(
        `Cannot resolve dependency at index ${i} for ${toHumanizeName(constructor)}.\n` +
          `Either add a type annotation to the parameter or use @Inject(token) decorator.`,
      );
    }

    return resolved;
  }

  /**
   * Resolves an abstract.
   * @param {Abstract<T>} abstract
   * @returns {T}
   */
  protected resolve<T = any>(abstract: Abstract<T>): T {
    // Check if the abstract is already resolved
    if (this.singletons.includes(abstract)) {
      const instance = this.instances.get(abstract);
      if (instance !== undefined) {
        return instance as T;
      }
    }

    this.fireCallbacks(abstract, this.globalBeforeCallbacks);
    const binding = this.bindings.get(abstract) as Concrete<T>;
    const isShared = this.singletons.includes(abstract);

    if (binding === undefined) {
      this.emit('missing', abstract);
      throw new Error(`[${toHumanizeName(abstract)}] is not bound.`);
    }

    let instance: T;
    this.buildStack.push(abstract);
    this.emit('queued', abstract);
    this.fireCallbacks(abstract, this.globalResolving);

    if (isUserDefinedClass(binding)) {
      const dependencies = this.resolveDependencies(binding as Constructor<T>);
      instance = new (binding as Constructor<T>)(...dependencies) as T;
    } else if (isUserDefinedFunction(binding)) {
      instance = (binding as Factory<T>)(this);
    } else {
      console.log(binding);
      instance = binding as T;
    }

    this.buildStack.pop();
    this.fireCallbacks(abstract, this.globalAfterCallbacks);
    this.resolved.push(abstract);
    if (isShared) {
      this.instances.set(abstract, instance);
    }
    this.emit('resolved', abstract, instance);
    return this.callExtenders<T>(abstract, instance);
  }

  /**
   * Resolves an abstract.
   * @param {Abstract<T>} abstract
   * @returns {T}
   */
  make<T = any>(abstract: Abstract<T>): T {
    return this.resolve(abstract);
  }

  /**
   * Registers a global resolving callback
   * @param {GlobalCallback} callback
   */
  resolving(callback: GlobalCallback): void {
    this.globalResolving.push(callback);
  }

  /**
   * Toggles whether or not to fire events
   * @returns {void}
   */
  toggleEvents(): void {
    this.fireEvents = !this.fireEvents;
  }

  /**
   * Extends an abstract
   * @param {Abstract<T>} abstract
   * @param {Extender<T>} cb
   */
  extend<T = any>(abstract: Abstract<T>, cb: Extender<T>): void {
    const existing = this.extenders.get(abstract) || [];
    existing.push(cb);
    this.extenders.set(abstract, existing);
  }

  /**
   * Calls extenders
   * @param {Abstract<T>} abstract
   * @param {T} instance
   * @returns  {T}
   */
  protected callExtenders<T = any>(abstract: Abstract<T>, instance: T): T {
    const extenders = this.extenders.get(abstract) || [];
    for (const extender of extenders) {
      instance = extender(instance, this);
    }
    return instance;
  }

  /**
   * Clears the container.
   * @returns {void}
   */
  clear(): void {
    this.bindings = new Map();
    this.buildStack = [];
    this.singletons = [];
    this.resolved = [];
    this.instances = new Map();
    this.globalBeforeCallbacks = [];
    this.globalAfterCallbacks = [];
    this.globalResolving = [];
    this.fireEvents = true;
    this.emit('cleared');
  }
}
