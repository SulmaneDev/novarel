/**
 * Constructor interface that represents a constructor.
 * @template T The type of the class being constructed.
 */
export interface Constructor<T = any> {
    new (...args: any[]): T;
}
