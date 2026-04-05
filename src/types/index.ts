// Barrel export for centralized type definitions
// Re-export all types from category files

// Site types
export type {
  SiteConfig,
  SiteMetadata,
  SiteMetadataConfig,
  NavigationConfig,
  SiteNavigation,
  GridColumns,
  MediaGridConfig,
  SiteImageConfig,
  StarfieldEffectConfig,
  SiteEffectsConfig,
  HomepageSectionKey,
  HomepageHeroDeckField,
  HomepageEditorialGapVariant,
  HomePageHero,
  HomePageImageConfig,
  HomePageCarouselSlideWidth,
  HomePageCarouselVisualConfig,
  HomePageCarouselConfig,
  HomePageFeaturedMediaConfig,
  HomePageConfig,
  HomePageConfigGroup,
  PhotographyPageConfig,
  MediaConfig,
  Publication,
  Home,
  HomepageConfig,
  HomepageConfigSlice,
} from './site';

// Profile types
export type {
  ProfileFact,
  ProfileData,
  ResolvedProfileData,
} from './profile';

// Page types
export type {
  LayoutProps,
} from './page';

// Media types
export type {
  ContentImageOptions,
  ContentImageResponsive,
  ContentImage,
  MediaImage,
  MediaAlbum,
  MediaCategory,
  MediaTree,
  FeaturedSlide,
} from './media';

export type {
  AboutPageData,
  HomePageData,
} from './site';