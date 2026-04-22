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

export async function loadProfile(): Promise<ProfileData> {
  return normalizeProfile(profile as ProfileData);
}

export async function loadSiteConfig(): Promise<SiteConfig> {
  return siteConfig;
}

export async function loadNavigationConfig(): Promise<NavigationConfig> {
  return siteConfig.navigation;
}

export async function loadHomepageConfig(): Promise<HomePageConfigGroup> {
  const { home } = siteConfig;

  return {
    hero: home.hero,
    layout: home.layout,
    editorialHero: home.editorialHero,
    featuredMedia: buildFeaturedMediaConfig(home.featuredMedia),
  };
}

export async function loadMediaConfig(): Promise<MediaConfig> {
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

export async function loadIntroduction(): Promise<string> {
  return introductionRaw;
}

export async function loadPhotography(): Promise<PhotographyPageConfig> {
  return resolvePhotographyConfig(siteConfig.photography);
}

export async function loadSiteMetadata(): Promise<SiteMetadata> {
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
