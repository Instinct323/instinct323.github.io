import {
  buildDeferredMountBootstrapOptions,
  initDeferredMountGroupSafely,
} from './deferred-mount-page';

export function initHomeCarouselDeferredMounts(): void {
  initDeferredMountGroupSafely(
    buildDeferredMountBootstrapOptions(
      '.home-carousel[data-carousel-lazy-config]',
      'carouselLazyConfig',
      'home-carousel-image',
    ),
    'home carousel',
  );
}
