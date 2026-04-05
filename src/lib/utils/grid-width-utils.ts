import { assertPositiveInteger } from './assertions';

export const MOBILE_BREAKPOINT = 767;
export const RESPONSIVE_VIEWPORT_WIDTHS = {
  desktop: 1440,
  tablet: 1024,
  mobile: 375,
} as const;

export interface GridDefinition {
  columns: {
    desktop: number;
    mobile: number;
  };
  gap: string;
}

function parse_grid_gap_to_px(gap: string): number {
  const normalized = gap.trim();
  const matched = normalized.match(/^(\d+(?:\.\d+)?)(px|rem)$/);

  if (!matched) {
    throw new Error(`Invalid photography.grid.gap: "${gap}". Expected px or rem value.`);
  }

  const value = Number.parseFloat(matched[1]);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid photography.grid.gap: "${gap}". Expected a non-negative value.`);
  }

  return matched[2] === 'rem' ? value * 16 : value;
}

function derive_grid_cell_width(viewport_width: number, columns: number, gap_px: number): number {
  if (!Number.isInteger(columns) || columns <= 0) {
    throw new Error(`Invalid grid columns: expected a positive integer, received ${String(columns)}.`);
  }

  const total_gap = (columns - 1) * gap_px;
  const content_width = viewport_width - total_gap;

  if (content_width <= 0) {
    throw new Error('Invalid gallery grid config: horizontal gaps exceed viewport width.');
  }

  return Math.round(content_width / columns);
}

export function deriveGridCellWidths(grid: GridDefinition, viewports: number[]): number[] {
  const gap_px = parse_grid_gap_to_px(grid.gap);

  return [
    derive_grid_cell_width(viewports[0], grid.columns.mobile, gap_px),
    derive_grid_cell_width(viewports[1], grid.columns.desktop, gap_px),
    derive_grid_cell_width(viewports[2], grid.columns.desktop, gap_px),
  ];
}

export function buildGridSizesString(grid: GridDefinition): string {
  const mobile_columns = assertPositiveInteger(
    grid.columns.mobile,
    'photography.grid.columns.mobile',
  );
  const desktop_columns = assertPositiveInteger(
    grid.columns.desktop,
    'photography.grid.columns.desktop',
  );

  const mobile_width = (100 / mobile_columns).toFixed(2);
  const desktop_width = (100 / desktop_columns).toFixed(2);

  return [
    `(max-width: ${MOBILE_BREAKPOINT}px) ${mobile_width}vw`,
    `${desktop_width}vw`,
  ].join(', ');
}
