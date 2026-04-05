import { loadNavigationConfig } from '../loaders/config-loader';

export interface SiteNavRoute {
  key: string;
  href: string;
  navTestId: string;
}

export interface SiteNavItem extends SiteNavRoute {
  label: string;
}

export interface SiteNavModel {
  ariaLabel: string;
  items: SiteNavItem[];
}

const NAV_ROUTES: Record<string, SiteNavRoute> = {
  home: {
    key: 'home',
    href: '/',
    navTestId: 'nav-home',
  },
  about: {
    key: 'about',
    href: '/about',
    navTestId: 'nav-about',
  },
  photography: {
    key: 'photography',
    href: '/photography',
    navTestId: 'nav-photography',
  },
  blog: {
    key: 'blog',
    href: '/blog',
    navTestId: 'nav-blog',
  },
};


export function formatPageLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function buildNavItems(routeKeys: string[]): SiteNavItem[] {
  return routeKeys.map((key) => ({
    key,
    href: NAV_ROUTES[key].href,
    navTestId: NAV_ROUTES[key].navTestId,
    label: formatPageLabel(key),
  }));
}

export async function loadPrimaryNavModel(): Promise<SiteNavModel> {
  const navigation = await loadNavigationConfig();
  const order = navigation.order;

  return {
    ariaLabel: '',
    items: buildNavItems(order),
  };
}
