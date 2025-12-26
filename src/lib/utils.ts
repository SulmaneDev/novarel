/**
 * Converts data to a human-readable name.
 * @param {unknown} data
 * @returns {string}
 */
export const toHumanizeName = (data: unknown): string => {
  if (typeof data === 'string') {
    return data.trim() || 'Unknown';
  }

  if (typeof data === 'symbol') {
    return data.description ?? 'Unknown';
  }

  if (typeof data === 'function') {
    return data.name || 'AnonymousFunction';
  }

  if (Array.isArray(data)) {
    return 'Array';
  }

  if (typeof data === 'object' && data !== null) {
    if (
      'name' in data &&
      typeof (data as { name?: unknown }).name === 'string'
    ) {
      const name = (data as { name: string }).name.trim();
      return name || 'Unknown';
    }
    return data.constructor?.name || 'Object';
  }

  if (typeof data === 'number') {
    return `Number(${data})`;
  }

  if (typeof data === 'boolean') {
    return `Boolean(${data})`;
  }

  if (typeof data === 'bigint') {
    return 'BigInt';
  }

  return 'Unknown';
};

/**
 * Checks if a value is a user-defined class
 * @param {unknown} value
 * @returns {boolean}
 */
export const isUserDefinedClass = (value: unknown): boolean => {
  if (typeof value !== 'function') return false;

  const source = Function.prototype.toString.call(value);
  return /^class/.test(source);
};

/**
 * Checks if a value is a user-defined function
 * @param {unknown} value
 * @returns {boolean}
 */
export const isUserDefinedFunction = (value: unknown): boolean => {
  if (typeof value !== 'function') return false;

  const source = Function.prototype.toString.call(value);

  if (source.startsWith('class ')) return false;

  return true;
};
