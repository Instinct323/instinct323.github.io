import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createCachedLoader } from './cache';

describe('createCachedLoader', () => {
  let originalDev: boolean;

  beforeEach(() => {
    originalDev = import.meta.env.DEV;
    import.meta.env.DEV = false;
  });

  afterEach(() => {
    import.meta.env.DEV = originalDev;
  });

  it('caches value and returns it on subsequent calls without re-invoking loader', async () => {
    const loader = vi.fn().mockResolvedValue('cached-result');
    const cachedLoader = createCachedLoader(loader);

    const result1 = await cachedLoader();
    const result2 = await cachedLoader();

    expect(result1).toBe('cached-result');
    expect(result2).toBe('cached-result');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('returns same promise for concurrent calls (deduplication)', async () => {
    let resolveFirst: (_value: string) => void;
    const firstCall = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });

    const loader = vi.fn().mockImplementation(() => firstCall);
    const cachedLoader = createCachedLoader(loader);

    const call1 = cachedLoader();
    const call2 = cachedLoader();
    expect(call1).toBe(call2); // same promise

    resolveFirst!('deduped-result');

    const [result1, result2] = await Promise.all([call1, call2]);

    expect(result1).toBe('deduped-result');
    expect(result2).toBe('deduped-result');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('calls init callback with loaded value on first call', async () => {
    const init = vi.fn();
    const loader = vi.fn().mockResolvedValue('init-value');
    const cachedLoader = createCachedLoader(loader, { init });

    await cachedLoader();

    expect(init).toHaveBeenCalledWith('init-value');
  });

  it('busts cache in DEV mode and re-invokes loader each time', async () => {
    import.meta.env.DEV = true;

    const loader = vi.fn().mockResolvedValue('fresh-result');
    const cachedLoader = createCachedLoader(loader);

    const result1 = await cachedLoader();
    const result2 = await cachedLoader();

    expect(result1).toBe('fresh-result');
    expect(result2).toBe('fresh-result');
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('calls init callback in DEV mode on every invocation', async () => {
    import.meta.env.DEV = true;

    const init = vi.fn();
    const loader = vi.fn().mockResolvedValue('dev-value');
    const cachedLoader = createCachedLoader(loader, { init });

    await cachedLoader();
    await cachedLoader();

    expect(init).toHaveBeenCalledTimes(2);
    expect(init).toHaveBeenCalledWith('dev-value');
  });

  it('handles synchronous loader values', async () => {
    const loader = vi.fn().mockReturnValue('sync-result');
    const cachedLoader = createCachedLoader(loader);

    const result1 = await cachedLoader();
    const result2 = await cachedLoader();

    expect(result1).toBe('sync-result');
    expect(result2).toBe('sync-result');
    expect(loader).toHaveBeenCalledTimes(1);
  });
});