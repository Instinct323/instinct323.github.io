import { buildDeferredMountGroupSelector } from './deferred-mount-contract';
import { initDeferredMounts } from './deferred-mount-runtime';

interface DeferredMountBootstrapOptions {
  containerSelector: string;
  configDataKey: string;
  mountGroup: string;
}

interface DeferredMountBootstrapConfig {
  rootMargin: string;
  mountDelayMs: number;
}

function assertBootstrapString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Invalid deferred mount bootstrap ${field}.`);
  }
  return value;
}

function parseBootstrapConfig(serializedConfig: string): DeferredMountBootstrapConfig {
  const rawConfig = JSON.parse(serializedConfig);
  const rootMargin = assertBootstrapString(rawConfig?.rootMargin, 'rootMargin');

  if (typeof rawConfig?.mountDelayMs !== 'number' || rawConfig.mountDelayMs < 0) {
    throw new Error('Invalid deferred mount bootstrap mountDelayMs.');
  }

  return {
    rootMargin,
    mountDelayMs: rawConfig.mountDelayMs,
  };
}

export function bootstrapDeferredMounts(options: DeferredMountBootstrapOptions): void {
  const containerSelector = assertBootstrapString(options.containerSelector, 'containerSelector');
  const configDataKey = assertBootstrapString(options.configDataKey, 'configDataKey');
  const mountGroup = assertBootstrapString(options.mountGroup, 'mountGroup');

  const container = document.querySelector(containerSelector);
  if (!(container instanceof HTMLElement)) {
    return;
  }

  const serializedConfig = container.dataset[configDataKey];
  if (!serializedConfig) {
    throw new Error('Missing deferred mount runtime config payload.');
  }

  const runtimeConfig = parseBootstrapConfig(serializedConfig);
  initDeferredMounts({
    selector: buildDeferredMountGroupSelector(mountGroup),
    rootMargin: runtimeConfig.rootMargin,
    mountDelayMs: runtimeConfig.mountDelayMs,
  });
}
