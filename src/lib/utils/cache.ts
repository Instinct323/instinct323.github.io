interface CacheState<T> {
  value: T | null;
  promise: Promise<T> | null;
}

/**
 * Creates a cached loader function that wraps a promise-returning loader.
 *
 * @param loader - Function that returns data (sync or async)
 * @param options - Optional init callback called when value is ready
 * @returns A function that returns a Promise resolving to the loaded data
 *
 * @example
 * ```ts
 * const getConfig = createCachedLoader(() => fetch('/api/config').then(r => r.json()));
 * // First call loads, subsequent calls in PROD return cached value
 * ```
 */
export function createCachedLoader<T>(
  loader: () => T | Promise<T>,
  options?: { init?: (_value: T) => void }
): () => Promise<T> {
  const state: CacheState<T> = { value: null, promise: null };

  return (): Promise<T> => {
    if (import.meta.env.DEV) {
      const freshPromise = Promise.resolve(loader()).then((result) => {
        options?.init?.(result);
        state.value = result;
        return result;
      });
      state.promise = freshPromise;
      return freshPromise;
    }

    if (state.value) {
      return Promise.resolve(state.value);
    }

    if (!state.promise) {
      state.promise = Promise.resolve(loader()).then((result) => {
        options?.init?.(result);
        state.value = result;
        return result;
      });
    }

    return state.promise;
  };
}