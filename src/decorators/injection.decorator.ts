import type { InjectionInterface } from '../interfaces/injection.interface.js';

/**
 * Symbol used to mark a class as injectable.
 */
export const INJECTION_KEY = Symbol('novarel:injection');

/**
 * Injects a class into a parameter.
 * @param {InjectionInterface<T>} abstract 
 * @returns {ParameterDecorator}
 */
export function Inject<T = any>(
  abstract: InjectionInterface<T>,
): ParameterDecorator {
  return (target, _name, index) => {
    const existingInjections: InjectionInterface<T>[] = Reflect.getMetadata(
      INJECTION_KEY,
      target,
    ) || [];
    existingInjections[index] = abstract;
    Reflect.defineMetadata(INJECTION_KEY, existingInjections, target);
  };
}
