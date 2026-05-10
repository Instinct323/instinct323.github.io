import type { HomePageConfig } from './home';
import type { MediaGridConfig, SiteImageConfig } from './image-config';
import type { SiteEffectsConfig } from './effects';
import type { ResolvedProfileData } from './profile';
import type { ContentImage } from './media';

export interface SiteMetadataInput {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  keyword?: string;
}

export interface SiteMetadata extends SiteMetadataInput {
}

export interface SiteNavigation {
  order: string[];
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

export interface AboutPageData {
  profile: ResolvedProfileData;
  introductionHtml: string;
  publications: Publication[];
  avatarImage: ContentImage;
}