import {
  IMAGE_HIGH_WIDTHS_KEY,
  selectCandidateWidthsByPolicy,
} from '../loaders/media-loader-core';

export const LAYOUT_MOBILE_HEIGHT = 812;
export const LAYOUT_DESKTOP_HEIGHT = 900;

export function selectBackgroundWidth(
  candidateWidths: number[],
  inferredWidth: number,
  dprScale: number,
  keySuffix: string,
  sourceMaxWidth: number,
): number {
  return selectCandidateWidthsByPolicy({
    candidateWidths,
    inferredWidths: [inferredWidth],
    dprScale,
    key: `${IMAGE_HIGH_WIDTHS_KEY}.${keySuffix}`,
    maxSelectableWidth: sourceMaxWidth,
  })[0];
}

export function inferCoverWidth(
  viewportWidth: number,
  viewportHeight: number,
  imageAspectRatio: number,
): number {
  const viewportAspectRatio = viewportWidth / viewportHeight;
  const cropExpansion = Math.max(1, imageAspectRatio / viewportAspectRatio);
  return Math.ceil(viewportWidth * cropExpansion);
}
