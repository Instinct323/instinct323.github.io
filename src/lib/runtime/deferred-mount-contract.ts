export const DEFERRED_MOUNT_DATA = {
  mount: 'data-deferred-mount',
  state: 'data-deferred-state',
  group: 'data-deferred-group',
  placeholder: 'data-deferred-placeholder',
  placeholderState: 'data-deferred-placeholder-state',
  placeholderText: 'data-deferred-placeholder-text',
  host: 'data-deferred-host',
  template: 'data-deferred-template',
} as const;

export const DEFERRED_MOUNT_STATE = {
  pending: 'pending',
  mounted: 'mounted',
  loaded: 'loaded',
  error: 'error',
} as const;

export function buildDeferredMountGroupSelector(group: string): string {
  if (typeof group !== 'string' || group.trim().length === 0) {
    throw new Error('Missing or invalid deferred mount group selector input.');
  }

  return `[${DEFERRED_MOUNT_DATA.group}="${group}"][${DEFERRED_MOUNT_DATA.mount}="true"]`;
}
