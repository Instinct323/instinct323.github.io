import { introductionRaw, profile, siteConfigRaw } from './content-paths';
import { parse } from 'jsonc-parser';

import { resolveFeaturedCarouselVisual } from '../domain/carousel-config';
import { resolveStarfieldEffectConfig } from '../domain/starfield-config';
import { resolveSiteImageConfig } from '../domain/image-config';

import type {
  HomePageConfigGroup,
  MediaConfig,
  NavigationConfig,
  PhotographyPageConfig,
  ProfileData,
  SiteEffectsConfig,
  SiteConfig,
  SiteMetadata,
} from '../../types';

function resolvePhotographyConfig(config: SiteConfig['photography']): PhotographyPageConfig {
  const source = config as Partial<PhotographyPageConfig>;

  if (!source.grid || typeof source.grid !== 'object' || Array.isArray(source.grid)) {
    throw new Error('Missing or invalid photography.grid configuration object');
  }

  return {
    grid: source.grid,
  };
}

/**
 * Parses raw site configuration JSONC string into a typed SiteConfig object.
 *
 * @sideEffect This function is called at module load time (line 71), not lazily.
 * When this module is imported, the configuration is parsed immediately.
 * This has important implications:
 * - Testing: The parsed config is cached in module scope. Tests that modify
 *   source files or mock the config loader may encounter stale cached values.
 * - Module imports: Any import of this module triggers config parsing, even if
 *   the imported functions are never called. This is eager evaluation.
 * - Runtime: Config errors will surface immediately on first import, not on
 *   first function call.
 *
 * @param raw - Raw JSONC string from site config file
 * @returns Parsed SiteConfig object
 * @throws Error if parsed config is not a valid object
 */
function parseSiteConfig(raw: string): SiteConfig {
  const parsed = parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid site config JSONC content');
  }

  return parsed as SiteConfig;
}

function buildFeaturedMediaConfig(featured: SiteConfig['home']['featuredMedia']): SiteConfig['home']['featuredMedia'] {
  const carousel = featured.carousel;

  return {
    items: featured.items,
    carousel: {
      ariaLabel: carousel.ariaLabel,
      prevButtonAriaLabel: carousel.prevButtonAriaLabel,
      nextButtonAriaLabel: carousel.nextButtonAriaLabel,
      emptyText: carousel.emptyText,
      showNavigationArrows: carousel.showNavigationArrows,
      showIndicator: carousel.showIndicator,
      counterPadLength: carousel.counterPadLength,
      visual: resolveFeaturedCarouselVisual(carousel.visual),
    },
  };
}

const siteConfig = parseSiteConfig(siteConfigRaw);

function normalizeProfile(profileData: ProfileData): ProfileData {
  return {
    ...profileData,
    facts: profileData.facts.map((fact) => ({
      id: fact.id.trim(),
      value: fact.value.trim(),
    })),
  };
}

export function loadProfile(): ProfileData {
  return normalizeProfile(profile as ProfileData);
}

export function loadSiteConfig(): SiteConfig {
  return siteConfig;
}

export function loadNavigationConfig(): NavigationConfig {
  return siteConfig.navigation;
}

export function loadHomepageConfig(): HomePageConfigGroup {
  const { home } = siteConfig;
  const featuredMedia = buildFeaturedMediaConfig(home.featuredMedia);

  return {
    hero: home.hero,
    layout: home.layout,
    editorialHero: home.editorialHero,
    featuredMedia,
    featuredCarousel: featuredMedia.carousel,
  };
}

export function loadMediaConfig(): MediaConfig {
  const featuredMedia = buildFeaturedMediaConfig(siteConfig.home.featuredMedia);

  return {
    grid: siteConfig.photography.grid,
    image: resolveSiteImageConfig(siteConfig.image),
    homepage: {
      featured: featuredMedia.items,
      carousel: featuredMedia.carousel,
    },
  };
}

export function loadIntroduction(): string {
  return introductionRaw;
}

export function loadPhotography(): PhotographyPageConfig {
  return resolvePhotographyConfig(siteConfig.photography);
}

export function loadSiteMetadata(): SiteMetadata {
  const { siteUrl, defaultTitle, defaultDescription, keyword } = siteConfig.metadata;

  return {
    siteUrl,
    defaultTitle,
    defaultDescription,
    keyword,
  };
}

export async function loadEffectsConfig(): Promise<SiteEffectsConfig> {
  const effects = siteConfig.effects;
  if (!effects || typeof effects !== 'object' || Array.isArray(effects)) {
    throw new Error('Missing or invalid effects configuration');
  }

  return {
    starfield: resolveStarfieldEffectConfig((effects as Partial<SiteEffectsConfig>).starfield),
  };
}
