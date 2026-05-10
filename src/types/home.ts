import type { HomePageCarouselConfig } from './carousel';
import type { SiteConfig } from './site';
import type { ResolvedProfileData } from './profile';

export type HomepageSectionKey = 'hero' | 'carousel';
export type HomepageHeroDeckField = 'location' | 'organization';
export type HomepageEditorialGapVariant = 'tight' | 'roomy';

export interface HomePageHero {
  eyebrow: string;
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

export type Home = HomePageHero;

export interface HomepageConfig {
  layout: HomePageConfig['layout'];
  editorialHero: HomePageConfig['editorialHero'];
  featuredCarousel: HomePageConfig['featuredMedia']['carousel'];
}

export type HomepageConfigSlice = HomePageConfigGroup;

export interface HomePageConfigGroup {
  hero: SiteConfig['home']['hero'];
  layout: SiteConfig['home']['layout'];
  editorialHero: SiteConfig['home']['editorialHero'];
  featuredMedia: SiteConfig['home']['featuredMedia'];
  featuredCarousel: SiteConfig['home']['featuredMedia']['carousel'];
}

export interface HomePageData {
  profile: ResolvedProfileData;
  site: SiteConfig;
  home: HomePageHero;
}