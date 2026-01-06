import { EventEmitter } from "events";
import { CONTAINER_EVENTS } from "../lib/constants.js";
import { NovarelException } from "./exception.js";
import { toHumanizeName } from "../lib/utils.js";


/**
 * `Container` class is used to manage the dependencies of the application.
 * @license MIT
 * @author Muhammad Sulman <https://github.com/SulmaneDev>
 * @version 0.1.0
 * @since 0.1.0
 * @extends EventEmitter
 */
export class Container extends EventEmitter {
    /**
     * Indicates whether to fire events or not
     * @type {boolean}
     * @private
     */
    #fireEvents = true;

    /**
     * The bindings of the container
     * @type {Map<any, any}
     * @private
     */
    #bindings = new Map();

    /**
     * The resolved instances of the container
     * @type {Array<any>}
     * @private
     */
    #resolved = [];

    /**
     * The aliases of the container
     * @type {Map<any, any>}
     * @private
     */
    #aliases = new Map();

    /**
     * The tagged binding of the container
     * @type {Map<any, any[]>}
     * @private
     */
    #tagged = new Map();

    /**
     * The instances of the container
     * @type {Map<any, any>}
     * @private
     */
    #instances = new Map();

    /**
     * The stack of the container
     * @type {Array<any>}
     * @private
     */
    #buildStack = [];

    /**
     * Determine whether to fire events or not
     * @type {boolean}
     */
    setFireEvents(value) {
        this.#fireEvents = value;
    }

    /**
     * Emit event
     * @param {string} event
     * @param {...any} args
     * @returns {boolean}
     */
    emit(event, ...args) {
        if (this.#fireEvents) {
            return super.emit(event, ...args);
        };
        return false;
    }

    /**
     * Determine whether an abstract is in the queue
     * @param {string} abstract
     * @returns {boolean}
     */
    inQueue(abstract) {
        return this.#buildStack.includes(abstract);
    }

    /**
     * Determine whether the container has a binding
     * @param {string} abstract
     * @returns {boolean}
     */
    hasBinding(abstract) {
        return this.#bindings.has(abstract);
    }

    /**
     * Determine whether the container has an instance
     * @param {string} abstract
     * @returns {boolean}
     */
    hasInstance(abstract) {
        return this.#instances.has(abstract);
    }

    /**
     * Determine whether an abstract is resolved
     * @param {string} abstract
     * @returns {boolean}
     */
    resolved(abstract) {
        return this.#resolved.includes(abstract);
    }

    /**
     * Bind an abstract to a binding
     * @param {string} abstract
     * @param {{ shared: boolean }} binding
     */
    bind(abstract, binding = { shared: false }) {
        binding = { shared: false, ...binding };
        this.#bindings.set(abstract, binding);
        this.emit(CONTAINER_EVENTS.CONTAINER_BIND, abstract);
    }

    /**
     * Bind an abstract to a singleton
     * @param {string} abstract
     * @param {{ shared: boolean }} binding
     */
    singleton(abstract, binding = { shared: true }) {
        binding = { shared: tr, ...binding };
        this.#bindings.set(abstract, binding);
        this.emit(CONTAINER_EVENTS.CONTAINER_BIND, abstract);
    }

    /**
     * Bind an abstract to a binding if it doesn't exist
     * @param {string} abstract
     * @param {{ shared: boolean }} binding
     */
    bindIf(abstract, binding = { shared: false }) {
        binding = { shared: false, ...binding };
        if (!this.#bindings.has(abstract)) {
            this.#bindings.set(abstract, binding);
            this.emit(CONTAINER_EVENTS.CONTAINER_BIND, abstract);
        }
    }


    /**
     * Bind an abstract to a singleton if it doesn't exist
     * @param {string} abstract
     * @param {{ shared: boolean }} binding
     */
    singletonIf(abstract, binding) {
        binding = { shared: true, ...binding };
        if (!this.#bindings.has(abstract)) {
            this.#bindings.set(abstract, binding);
            this.emit(CONTAINER_EVENTS.CONTAINER_BIND, abstract);
        }
    }

    /**
     * Bind an abstract to an instance
     * @param {string} abstract
     * @param {any} instance
     */
    instance(abstract, instance) {
        this.#instances.set(abstract, instance);
        this.#resolved.push(abstract);
        this.emit(CONTAINER_EVENTS.CONTAINER_INSTANCE, abstract);
    }

    /**
     * Bind an abstract to an instance if it doesn't exist
     * @param {string} abstract
     * @param {any} instance
     */
    instanceIf(abstract, instance) {
        if (!this.#instances.has(abstract)) {
            this.#instances.set(abstract, instance);
            this.#resolved.push(abstract);
            this.emit(CONTAINER_EVENTS.CONTAINER_INSTANCE, abstract);
        }
    }


    /**
     * Bind an abstract to an alias
     * @param {string} alias
     * @param {string} abstract
     */
    alias(alias, abstract) {
        if (alias === abstract) {
            throw new NovarelException(`Can't alias [${toHumanizeName(abstract)}] to itself.`);
        };
        this.#aliases.set(alias, abstract);
    }

    /**
     * Tag an abstract to a tag
     * @param {any} tag
     * @param {...any} abstracts
     */
    tag(tag, ...abstracts) {
        const existing = this.#tagged.get(tag) || [];
        existing.push(...abstracts);
        this.#tagged.set(tag, existing);
    }

    /**
     * Resolve dependencies of a constructor
     * @param {Function} constructor
     * @returns {Array<any>}
     */
    #resolveDependencies(constructor) {
        if (typeof constructor !== "function") {
            throw new NovarelException(`[${toHumanizeName(constructor)}] is not a constructor.`);
        };
        if (typeof constructor['$injections'] !== "undefined" && Array.isArray(constructor['$injections'])) {
            const resolved = (constructor['$injections'] || []).map((dependency) => {
                return this.make(dependency);
            });
            return resolved || [];
        } else if (typeof constructor['$inject'] !== "undefined" && typeof (constructor['$inject']) === "function") {
            const resolved = constructor.$inject(this) || [];
            return resolved;
        } else {
            throw new NovarelException(`[${toHumanizeName(constructor)}] is an invalid constructor.`);
        };
    }

    /**
     * Resolve alias of an abstract
     * @param {string} alias
     * @returns {string}
     */
    #resolveAlias(alias) {
        while (this.#aliases.has(alias)) {
            alias = this.#aliases.get(alias);
        };
        return alias;
    }

    #resolve(abstract) {
        abstract = this.#resolveAlias(abstract);

        if (this.resolved(abstract) && this.hasInstance(abstract)) {
            this.emit(CONTAINER_EVENTS.CONTAINER_RESOLVED, abstract);
            return this.#instances.get(abstract);
        }

        const binding = this.#bindings.get(abstract);
        const shared = binding?.shared || false;

        if (binding === undefined) {
            this.emit(CONTAINER_EVENTS.CONTAINER_MISSING, abstract);
            throw new NovarelException(`Target binding [${toHumanizeName(abstract)}] not found.`);
        };

        if (this.inQueue(abstract)) {
            this.emit(CONTAINER_EVENTS.CONTAINER_CIRCULAR, abstract);
            throw new NovarelException(`Target binding [${toHumanizeName(abstract)}] is in queue.`);
        }

        let instance;
        this.#buildStack.push(abstract);
        this.emit(CONTAINER_EVENTS.CONTAINER_RESOLVING, abstract);

        try {
            if (typeof binding?.useValue !== "undefined") {
                instance = binding?.useValue;
            } else if (typeof binding?.useFactory !== "undefined") {
                instance = binding?.useFactory(this);
            } else if (typeof binding?.useClass !== "undefined") {
                const deps = this.#resolveDependencies(binding?.useClass);
                instance = new (binding?.useClass)(...deps);
            } else {
                this.emit(CONTAINER_EVENTS.CONTAINER_INVALID, abstract);
                throw new NovarelException(`Target binding [${toHumanizeName(abstract)}] is an invalid binding.`);
            }
        } catch (e) {
            this.emit(CONTAINER_EVENTS.CONTAINER_ERROR, abstract);
            throw new NovarelException(`Target binding [${toHumanizeName(abstract)}] failed to resolve.`);
        }

        this.#buildStack.pop();
        this.#resolved.push(abstract);
        if (shared) {
            this.#instances.set(abstract, instance);
        }
        this.emit(CONTAINER_EVENTS.CONTAINER_RESOLVED, abstract);
        return instance;
    }

    /**
     * Make an instance of an abstract
     * @param {string} abstract
     * @returns {any}
     */
    make(abstract) {
        return this.#resolve(abstract);
    }

    /**
     * Make a lazy instance of an abstract
     * @param {string} abstract
     * @returns {any}
     */
    makeLazy(abstract) {
        let instance = null;
        return new Proxy({}, {
            get: (_target, property) => {
                if (!instance) {
                    instance = this.make(abstract);
                }
                const value = instance[property];
                return typeof value === "function" ? value.bind(instance) : value;
            }
        });
    }

    /**
     * Get an instance of an abstract
     * @param {string} abstract
     * @returns {any}
     */
    get(abstract) {
        return this.make(abstract);
    }

    /**
     * Make multiple instances of abstracts
     * @param {...string} abstracts
     * @returns {Array<any>}
     */
    makeMany(...abstracts) {
        return abstracts.map(e => this.make(e));
    }

    /**
     * Get multiple instances of abstracts
     * @param {...string} abstracts
     * @returns {Array<any>}
     */
    getMany(...abstracts) {
        return abstracts.map(e => this.get(e));
    }

    /**
     * Make multiple instances of abstracts tagged with a tag
     * @param {any} tag
     * @returns {Array<any>}
     */
    tagged(tag) {
        return this.makeMany(this.#tagged.get(tag) || []);
    }

    /**
     * Resolve dependencies of a constructor
     * @param {Function} constructor
     * @returns {Array<any>}
     */
    resolveDependencies(constructor) {
        return this.#resolveDependencies(constructor);
    }

    /**
     * Make an instance of an abstract asynchronously
     * @param {string} abstract
     * @returns {Promise<any>}
     */
    makeAsync(abstract) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.make(abstract));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Reset the container
     */
    reset() {
        this.#bindings.clear();
        this.#aliases.clear();
        this.#tagged.clear();
        this.#instances.clear();
        this.#resolved = [];
        this.#buildStack = [];
        this.#fireEvents = true;
    }
};