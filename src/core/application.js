import { Container } from './container.js';
import { NovarelException } from './exception.js';

/**
 * `Application` class is core class of the framework.
 * @license MIT
 * @author Muhammad Sulman <https://github.com/SulmaneDev>
 * @version 0.1.0
 * @since 0.1.0
 * @extends Container
 */
export class Application extends Container {
    /**
     * List of providers
     * @type {Function}
     * @private
     */
    #providers = [];

    /**
     * List of booted providers.
     * @type {Function}
     * @private
     */
    #bootedProviders = [];

    /**
     * Indicates that weather application is booted.
     */
    #booted = false;

    /**
     * Indicates that weather application has been booted already.
     */
    #hasBeenBooted = false;

    /**
     * The base path
     * @type {string}
     * @private
     */
    #basePath;

    /**
     * Create a new `Application` instance.
     * @param {string} basePath The base path
     */
    constructor(basePath = process.cwd()) {
        super();
        this.#basePath = basePath;
        this.#bindBaseBindings();
    }

    /**
     * Bind base bindings to the container
     */
    #bindBaseBindings() {
        this.instance('BASE_PATH', this.#basePath);
        this.instance(Application, this);
        this.instance(Container, this);
    }

    /**
     * Check if the provider is valid
     */
    #isValidProvider(provider) {
        if (typeof provider === "undefined") {
            throw new NovarelException("Invalid [Provider] in provider list.");
        };
        if (typeof provider?.register !== "function" || typeof provider?.boot !== "function") {
            throw new NovarelException("Invalid [Provider] in provider list.");
        };
        return true;
    }

    /**
     * Call provider register method
     */
    async #callToRegisterMethod(provider) {
        await provider?.register(this);
    }


    /**
     * Call provider boot method
     */
    async #callToBootMethod(provider) {
        await provider?.boot(this);
    }

    /**
     * Mark provider as booted
     */
    async #markAsBooted(provider) {
        this.#bootedProviders.push(provider);
    }


    /**
     * Starts the booting process
     */
    async #startBooting() {
        if (this.#booted) {
            return;
        }
        for (const provider of this.#providers) {
            this.#isValidProvider(provider);
            await this.#callToRegisterMethod(provider);
        }
        for (const provider of this.#providers) {
            this.#isValidProvider(provider);
            await this.#callToBootMethod(provider);
            await this.#markAsBooted(provider);
        };
        this.#hasBeenBooted = true;
        this.#booted = true;
    }

    /**
     * Boot the application
     */
    async boot() {
        await this.#startBooting();
    }

    /**
     * Registers a provider to the application
     * @param {Function} provider
     * @returns {void}
     */
    provide(provider) {
        this.#providers.push(provider);
    }

    /**
     * Registers multiple providers to the application
     * @returns {void}
     */
    provideMany(...providers) {
        providers.forEach(this.provide);
    }

    /**
     * Check if the application has been booted
     */
    hasBeenBooted() {
        return this.#hasBeenBooted;
    }

    /**
     * Check if the application is booted
     */
    booted() {
        return this.#booted;
    }

    /**
     * Reset the application
     */
    reset() {
        super.reset();
        this.#booted = false;
        this.#providers = [];
        this.#bootedProviders = [];
    }
};
