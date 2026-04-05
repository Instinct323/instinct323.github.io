import type { LayoutProps } from '../../types/page';

export type { LayoutProps };

interface ShellTokenConfig {
  overlayAccentPrimary: string;
  overlayAccentSecondary: string;
  surfaceBg: string;
  cardSurfaceBg: string;
  surfaceBorder: string;
  pageCanvas: string;
  textStrong: string;
  textBody: string;
  textMuted: string;
}

const ELEVATED_SHELL_TOKENS: ShellTokenConfig = {
  overlayAccentPrimary: 'var(--shell-hero-accent-primary)',
  overlayAccentSecondary: 'var(--shell-hero-accent-secondary)',
  surfaceBg: 'var(--shell-elevated-surface-bg)',
  cardSurfaceBg: 'var(--shell-elevated-card-bg)',
  surfaceBorder: 'var(--shell-elevated-surface-border)',
  pageCanvas: 'var(--shell-elevated-canvas)',
  textStrong: 'var(--shell-home-text-strong)',
  textBody: 'var(--shell-home-text-body)',
  textMuted: 'var(--shell-home-text-muted)',
};

const shellTokens: Partial<Record<string, ShellTokenConfig>> = {
  home: ELEVATED_SHELL_TOKENS,
  about: ELEVATED_SHELL_TOKENS,
  photography: {
    ...ELEVATED_SHELL_TOKENS,
    textStrong: 'var(--shell-text-strong-photography)',
    textBody: 'var(--shell-text-body-photography)',
    textMuted: 'var(--shell-text-muted-photography)',
  },
};

const contentWidthTokens: Record<string, string> = {
  compact: 'var(--page-width-compact)',
  standard: 'var(--page-width-standard)',
  wide: 'var(--page-width-wide)',
};

function resolveContentWidth(contentWidth: string): string {
  if (contentWidth in contentWidthTokens) {
    return contentWidthTokens[contentWidth];
  }

  return contentWidth;
}

const PAGE_OVERLAY = 'var(--page-overlay)';

export function buildShellStyle(
  shell: string,
  contentWidth: string,
): string {
  const shellConfig = shellTokens[shell];
  const layoutContentWidth = resolveContentWidth(contentWidth);

  const shellStyleTokens: Record<string, string> = {
    '--page-overlay': PAGE_OVERLAY,
    '--layout-content-width': layoutContentWidth,
  };

  if (shellConfig) {
    Object.assign(shellStyleTokens, {
      '--page-overlay-accent-primary': shellConfig.overlayAccentPrimary,
      '--page-overlay-accent-secondary': shellConfig.overlayAccentSecondary,
      '--surface-bg': shellConfig.surfaceBg,
      '--card-surface-bg': shellConfig.cardSurfaceBg,
      '--surface-border': shellConfig.surfaceBorder,
      '--page-canvas': shellConfig.pageCanvas,
      '--text-strong': shellConfig.textStrong,
      '--text-body': shellConfig.textBody,
      '--text-muted': shellConfig.textMuted,
    });
  }

  return Object.entries(shellStyleTokens)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ');
}