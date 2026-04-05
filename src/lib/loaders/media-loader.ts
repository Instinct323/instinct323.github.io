import { loadMediaConfig } from './config-loader';
import { ABOUT_AVATAR_SIZES } from './content-paths';
import { buildGridSizesString, MOBILE_BREAKPOINT } from '../utils/grid-width-utils';
import type {
  ContentImage,
  ContentImageOptions,
  FeaturedSlide,
  MediaConfig,
  MediaImage,
  MediaTree,
} from '../../types';
import {
  HOME_COVERFLOW_SIZES,
  IMAGE_MEDIUM_WIDTHS_KEY,
  assertMediaConfigShape,
  deriveGalleryInferredWidthsFromGrid,
  getValidatedHomepageGalleryConfig,
  loadFeaturedSlidesForHomepage,
  loadMediaTreeFromGallery,
  loadContentImageResolved,
  selectCandidateWidthsByPolicy,
} from './media-loader-core';

let mediaConfigCache: MediaConfig | null = null;
let mediaConfigPromise: Promise<MediaConfig> | null = null;
const ABOUT_AVATAR_SIZES_STRING = `(max-width: ${MOBILE_BREAKPOINT}px) ${ABOUT_AVATAR_SIZES[0]}px, ${ABOUT_AVATAR_SIZES[1]}px`;
const ABOUT_AVATAR_INFERRED_WIDTHS = [...ABOUT_AVATAR_SIZES];

interface SurfaceSizingProfile {
  inferredWidths: number[];
  sizes: string;
}

function resolveMediumSurfaceProfile(
  mediaConfig: MediaConfig,
  surface: string,
): SurfaceSizingProfile {
  if (surface === 'about') {
    return {
      inferredWidths: ABOUT_AVATAR_INFERRED_WIDTHS,
      sizes: ABOUT_AVATAR_SIZES_STRING,
    };
  }

  return {
    inferredWidths: deriveGalleryInferredWidthsFromGrid(mediaConfig.grid),
    sizes: buildGallerySizes(mediaConfig.grid),
  };
}

async function getMediaConfigCached(): Promise<MediaConfig> {
  if (import.meta.env.DEV) {
    const config = await loadMediaConfig();
    assertMediaConfigShape(config);
    mediaConfigCache = config;
    mediaConfigPromise = Promise.resolve(config);
    return config;
  }

  if (mediaConfigCache) {
    return mediaConfigCache;
  }

  if (!mediaConfigPromise) {
    mediaConfigPromise = loadMediaConfig().then((config) => {
      assertMediaConfigShape(config);
      mediaConfigCache = config;
      return config;
    });
  }

  return mediaConfigPromise;
}

async function deriveContentImageOptionsFromConfig(
  mediaConfig: MediaConfig,
  surface: string,
  overrides: Partial<ContentImageOptions>
): Promise<ContentImageOptions> {
  const globalImage = mediaConfig.image;
  const common = {
    format: globalImage.format,
    quality: globalImage.quality,
  };
  const homepageGalleryConfig = surface === 'home'
    ? await getValidatedHomepageGalleryConfig(getMediaConfigCached)
    : null;

  const base: ContentImageOptions = surface === 'home'
    ? {
        ...common,
        widths: homepageGalleryConfig?.image.widths,
        sizes: HOME_COVERFLOW_SIZES,
      }
    : buildMediumSurfaceOptions(mediaConfig, surface, common);

  return {
    alt: overrides.alt ?? base.alt,
    format: overrides.format ?? base.format,
    quality: overrides.quality ?? base.quality,
    widths: overrides.widths ?? base.widths,
    sizes: overrides.sizes ?? base.sizes,
    maxLongEdge: overrides.maxLongEdge ?? base.maxLongEdge,
  };
}

function buildMediumSurfaceOptions(
  mediaConfig: MediaConfig,
  surface: string,
  common: Pick<ContentImageOptions, 'format' | 'quality'>,
): ContentImageOptions {
  const profile = resolveMediumSurfaceProfile(mediaConfig, surface);

  return {
    ...common,
    widths: selectCandidateWidthsByPolicy({
      candidateWidths: mediaConfig.image.widths.medium,
      inferredWidths: profile.inferredWidths,
      dprScale: mediaConfig.image.dprScale.medium,
      key: IMAGE_MEDIUM_WIDTHS_KEY,
    }),
    sizes: profile.sizes,
  };
}

function buildGallerySizes(grid: MediaConfig['grid']): string {
  return buildGridSizesString(grid);
}

export async function deriveContentImageOptions(
  surface: string,
  overrides: Partial<ContentImageOptions>
): Promise<ContentImageOptions> {
  const mediaConfig = await getMediaConfigCached();
  return deriveContentImageOptionsFromConfig(mediaConfig, surface, overrides);
}

export async function loadContentImage(path: string, options: ContentImageOptions): Promise<ContentImage | null> {
  await getMediaConfigCached();
  return loadContentImageResolved(path, options);
}

export async function loadFeaturedSlides(): Promise<FeaturedSlide[]> {
  const homepageGalleryConfig = await getValidatedHomepageGalleryConfig(getMediaConfigCached);
  const homeImageOptions = await deriveContentImageOptions('home', {});

  return loadFeaturedSlidesForHomepage(homepageGalleryConfig.featured, homeImageOptions, loadContentImage);
}

function mapGalleryImage(path: string, options: ContentImageOptions): MediaImage | null {
  const imageAsset = loadContentImageResolved(path, options);

  if (!imageAsset) {
    return null;
  }

  return {
    path: imageAsset.path,
    alt: imageAsset.alt,
    width: imageAsset.width,
    height: imageAsset.height,
    aspectRatio: imageAsset.aspectRatio,
    responsive: imageAsset.responsive,
    src: imageAsset.source,
  };
}

export async function loadMediaTree(): Promise<MediaTree> {
  const mediaConfig = await getMediaConfigCached();
  const galleryImageOptions = await deriveContentImageOptionsFromConfig(mediaConfig, 'photography', {});

  return loadMediaTreeFromGallery(mediaConfig.grid, galleryImageOptions, mapGalleryImage);
}
