export const CONTENT_ROOT = '../../content';

// Content directories
export const ABOUT_DIR = `${CONTENT_ROOT}/about`;
export const BACKGROUND_DIR = `${CONTENT_ROOT}/background`;
export const PHOTOGRAPHY_DIR = `${CONTENT_ROOT}/photography`;
export const PUBLICATION_DIR = `${ABOUT_DIR}/publication`;

// Config files
export const CONFIG_FILE = `${CONTENT_ROOT}/config.jsonc`;

// Raw imports (for Vite ?raw)
export const INTRODUCTION_MD_RAW = `${ABOUT_DIR}/introduction.md?raw`;
export const SITE_JSONC_RAW = `${CONFIG_FILE}?raw`;

// Filter strings
export const PHOTOGRAPHY_FILTER = '/content/photography/';

// Specific files
export const PROFILE_JSON = `${ABOUT_DIR}/profile.json`;
export const AVATAR_JPG = `${ABOUT_DIR}/avatar.jpg`;
export const DESKTOP_BG_JPG = `${BACKGROUND_DIR}/desktop.jpg`;
export const MOBILE_BG_JPG = `${BACKGROUND_DIR}/mobile.jpg`;

// Re-exported modules
export { default as introductionRaw } from '../../content/about/introduction.md?raw';
export { default as profile } from '../../content/about/profile.json';
export { default as siteConfigRaw } from '../../content/config.jsonc?raw';
export { default as backgroundDesktopSource } from '../../content/background/desktop.jpg';
export { default as backgroundMobileSource } from '../../content/background/mobile.jpg';
