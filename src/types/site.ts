
import type { ImageLoadingEffectName } from '../lib/domain/image-loading-effect-registry';

export interface SiteMetadataInput {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
}

export interface SiteMetadata extends SiteMetadataInput {
}

export interface SiteNavigation {
  order: string[];
}

export interface GridColumns {
  desktop: number;
  mobile: number;
}

export interface MediaGridConfig {
  columns: GridColumns;
  gap: string;
}

export interface SiteImageConfig {
  format: string;
  quality: number;
  widths: {
    medium: number[];
    high: number[];
  };
  dprScale: {
    low: number;
    medium: number;
    high: number;
  };
  lazyLoad: {
    rootMargin: string;
    localDebugDelayMs: number;
  };
  placeholderEffect: ImageLoadingEffectName;
}

export interface StarfieldEffectConfig {
  enabled: boolean;
  starDensity: 'low' | 'medium' | 'high' | 'ultra';
  starSize: {
    min: number;
    max: number;
  };
  speedFactor: number;
  maxDistance: number;
  starColor: string;
  starOpacity: number;
  linkOpacity: number;
  starShapes: ('circle' | 'star')[];
  parallaxEffect: boolean;
  parallaxStrength: number;
  mouseRadius: number;
  rotationSpeed: {
    min: number;
    max: number;
  };
  connectionsWhenNoMouse: boolean;
  percentStarsConnecting: number;
  lineThickness: number;
}

export interface SiteEffectsConfig {
  starfield: StarfieldEffectConfig;
}

export type HomepageSectionKey = 'hero' | 'carousel';
export type HomepageHeroDeckField = 'location' | 'organization';
export type HomepageEditorialGapVariant = 'tight' | 'roomy';

export interface HomePageHero {
  eyebrow: string;
}

export interface HomePageImageConfig {
  quality: number;
  widths: number[];
  format: string;
}

export interface HomePageCarouselSlideWidth {
  desktop: string;
  tablet: string;
  mobile: string;
}

export interface HomePageCarouselVisualConfig {
  spaceBetween: number;
  slideWidth: HomePageCarouselSlideWidth;
  inactiveOpacity: number;
}

export interface HomePageCarouselConfig {
  ariaLabel: string;
  prevButtonAriaLabel: string;
  nextButtonAriaLabel: string;
  emptyText: string;
  showNavigationArrows: boolean;
  showIndicator: boolean;
  counterPadLength: number;
  visual: HomePageCarouselVisualConfig;
}

export interface HomePageFeaturedMediaConfig {
  items: string[];
  carousel: HomePageCarouselConfig;
}

export interface HomePageConfig {
  hero: HomePageHero;
  layout: {
    contentWidth: 'compact' | 'standard' | 'wide';
    sectionOrder: HomepageSectionKey[];
    editorialGapVariant: HomepageEditorialGapVariant;
  };
  editorialHero: {
    deckFields: HomepageHeroDeckField[];
    showDeckDivider: boolean;
  };
  featuredMedia: HomePageFeaturedMediaConfig;
}

export interface PhotographyPageConfig {
  grid: MediaGridConfig;
}

export interface SiteConfig {
  metadata: SiteMetadataInput;
  navigation: SiteNavigation;
  home: HomePageConfig;
  image: SiteImageConfig;
  photography: PhotographyPageConfig;
  effects: SiteEffectsConfig;
}

export type SiteMetadataConfig = SiteConfig['metadata'];
export type NavigationConfig = SiteConfig['navigation'];

export interface HomePageConfigGroup {
  hero: SiteConfig['home']['hero'];
  layout: SiteConfig['home']['layout'];
  editorialHero: SiteConfig['home']['editorialHero'];
  featuredMedia: SiteConfig['home']['featuredMedia'];
}

export interface MediaConfig {
  grid: SiteConfig['photography']['grid'];
  image: SiteConfig['image'];
  homepage: {
    featured: SiteConfig['home']['featuredMedia']['items'];
    carousel: SiteConfig['home']['featuredMedia']['carousel'];
  };
}

export interface Publication {
  title: string;
  abstract?: string;
  authors: string[];
  date: string;
  source?: string;
  links?: Record<string, string>;
}

export type Home = HomePageHero;

export interface HomepageConfig {
  layout: HomePageConfig['layout'];
  editorialHero: HomePageConfig['editorialHero'];
  featuredCarousel: HomePageConfig['featuredMedia']['carousel'];
}

export type HomepageConfigSlice = HomePageConfigGroup;

import type { ResolvedProfileData } from './profile';
import type { ContentImage } from './media';

export interface AboutPageData {
  profile: ResolvedProfileData;
  introductionHtml: string;
  publications: Publication[];
  avatarImage: ContentImage;
}

export interface HomePageData {
  profile: ResolvedProfileData;
  site: SiteConfig;
  home: HomePageHero;
}