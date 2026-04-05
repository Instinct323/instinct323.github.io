export interface IdleScheduleOptions {
  timeout: number;
  fallbackDelayMs: number;
}

const DEFAULT_IDLE_SCHEDULE_OPTIONS: IdleScheduleOptions = {
  timeout: 1000,
  fallbackDelayMs: 150,
};

export const SHELL_BACKGROUND_TIMEOUT = 2000;
export const SHELL_BACKGROUND_FALLBACK = 180;
export const CAROUSEL_PREWARM_TIMEOUT = 1200;
export const CAROUSEL_PREWARM_FALLBACK = 250;

export function runWhenIdle(
  callback: () => void,
  options: Partial<IdleScheduleOptions> = {},
): void {
  const { timeout, fallbackDelayMs } = {
    ...DEFAULT_IDLE_SCHEDULE_OPTIONS,
    ...options,
  };

  try {
    window.requestIdleCallback(() => {
      callback();
    }, { timeout });
  } catch {
    window.setTimeout(() => {
      callback();
    }, fallbackDelayMs);
  }
}
