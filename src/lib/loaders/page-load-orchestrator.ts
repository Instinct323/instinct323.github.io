import type {
  PageLoadStage,
  PageLoadPlan,
  PageLoadResult,
  ControlImagePriority,
  ControlImageLoadingAttrs,
} from '../../types/page-load';

export { PAGE_LOAD_PRIORITY } from '../../types/page-load';
export type { PageLoadStage };

export function resolveControlImageLoading(priority: ControlImagePriority): ControlImageLoadingAttrs {
  if (priority === 'critical') {
    return { loading: 'eager', decoding: 'sync', fetchPriority: 'high' };
  }
  return { loading: 'lazy', decoding: 'async', fetchPriority: 'auto' };
}

export async function orchestratePageLoad<TFrame, TBackground = null, TControls = null>(
  plan: PageLoadPlan<TFrame, TBackground, TControls>,
): Promise<PageLoadResult<TFrame, TBackground, TControls>> {
  const frame = await plan.frame();
  const controls = plan.controls ? await plan.controls({ frame }) : null;
  const background = plan.background ? await plan.background({ frame }) : null;
  return { frame, background: background as TBackground, controls: controls as TControls };
}