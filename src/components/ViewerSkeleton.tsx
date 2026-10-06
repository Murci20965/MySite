type Props = {
  /** True once the model has loaded: the skeleton fades out over the canvas. */
  ready?: boolean;
};

/**
 * Skeleton for the 3D viewer (transitions.dev 14, transform/opacity-only
 * variant). It sits in the viewer's own slot, so the swap to the live canvas
 * is layout-free: a placeholder orb pulses (opacity), a highlight band sweeps
 * across (transform), and the whole layer fades out once the model is ready.
 * Used twice: while the viewer's code chunk downloads, then while the GLB
 * loads, so both waits read as one continuous state.
 */
export default function ViewerSkeleton({ ready = false }: Props) {
  return (
    <div
      className={`t-skel-viewer ${ready ? 'is-ready' : ''}`}
      role="status"
      aria-hidden={ready || undefined}
    >
      <span className="t-skel-orb" aria-hidden="true" />
      <span className="t-skel-sweep" aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        Loading 3D model
      </span>
    </div>
  );
}
