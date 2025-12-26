/**
 * Symbol used to mark a class as injectable.
 */
export const INJECTABLE_KEY = Symbol('novarel:injectable');

/**
 * Marks a class as injectable.
 * @returns {ClassDecorator}
 */
export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
  };
}
