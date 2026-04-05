import type { SiteImageConfig } from '../../types';
import {
  assertFiniteNumber,
  assertObject,
  assertString,
} from '../utils/assertions';
import {
  IMAGE_LOADING_EFFECT_NAMES,
  type ImageLoadingEffectName,
} from './image-loading-effect-registry';

const IMAGE_LOADING_EFFECT_NAME_SET = new Set<string>(IMAGE_LOADING_EFFECT_NAMES);

function isImageLoadingEffectName(value: string): value is ImageLoadingEffectName {
  return IMAGE_LOADING_EFFECT_NAME_SET.has(value);
}

export function resolveImageLazyLoadConfig(config: unknown): SiteImageConfig['lazyLoad'] {
  const source = assertObject<Partial<SiteImageConfig['lazyLoad']>>(config, 'image.lazyLoad');
  const rootMargin = assertString(source.rootMargin, 'image.lazyLoad.rootMargin');
  const localDebugDelayMs = assertFiniteNumber(
    source.localDebugDelayMs,
    'image.lazyLoad.localDebugDelayMs',
  );

  if (!Number.isInteger(localDebugDelayMs) || localDebugDelayMs < 0) {
    throw new Error('Missing or invalid image.lazyLoad.localDebugDelayMs (must be a non-negative integer)');
  }

  return {
    rootMargin,
    localDebugDelayMs,
  };
}

export function resolveImagePlaceholderEffectConfig(config: unknown): SiteImageConfig['placeholderEffect'] {
  const effectName = assertString(config, 'image.placeholderEffect');

  if (!isImageLoadingEffectName(effectName)) {
    throw new Error(
      `Missing or invalid image.placeholderEffect (must be one of: ${IMAGE_LOADING_EFFECT_NAMES.join(', ')})`,
    );
  }

  return effectName;
}

export function resolveSiteImageConfig(config: unknown): SiteImageConfig {
  const source = assertObject<Partial<SiteImageConfig>>(config, 'image');
  const format = assertString(source.format, 'image.format');
  const quality = assertFiniteNumber(source.quality, 'image.quality');

  if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
    throw new Error('Missing or invalid image.quality (must be an integer in [1, 100])');
  }

  const widths = source.widths;
  const widthConfig = assertObject<SiteImageConfig['widths']>(widths, 'image.widths');

  const normalizeWidths = (values: unknown, key: string): number[] => {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error(`Missing or invalid ${key} (must be a non-empty number array)`);
    }

    return values.map((value) => {
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`Missing or invalid ${key} entry (must be positive integer)`);
      }
      return value;
    });
  };

  const dprScale = assertObject<SiteImageConfig['dprScale']>(source.dprScale, 'image.dprScale');

  const lowScale = assertFiniteNumber(dprScale.low, 'image.dprScale.low');
  const mediumScale = assertFiniteNumber(dprScale.medium, 'image.dprScale.medium');
  const highScale = assertFiniteNumber(dprScale.high, 'image.dprScale.high');
  if (lowScale <= 0 || mediumScale <= 0 || highScale <= 0) {
    throw new Error('Missing or invalid image.dprScale values (must be > 0)');
  }

  return {
    format,
    quality,
    widths: {
      medium: normalizeWidths(widthConfig.medium, 'image.widths.medium'),
      high: normalizeWidths(widthConfig.high, 'image.widths.high'),
    },
    dprScale: {
      low: lowScale,
      medium: mediumScale,
      high: highScale,
    },
    lazyLoad: resolveImageLazyLoadConfig(source.lazyLoad),
    placeholderEffect: resolveImagePlaceholderEffectConfig(source.placeholderEffect),
  };
}
