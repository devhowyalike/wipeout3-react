import { useEffect, useRef } from "react";
import { attach, detach, setNoise, setRoll } from "./crtRenderer";

interface ScanlineFilter1Props {
  /** Animate the scanline roll by incrementing `uTime` each frame. Defaults to `false`. */
  roll?: boolean;
  /** Randomise `uSeed` each frame to animate the noise grain. Defaults to `true`. */
  noise?: boolean;
}

/**
 * Thin host for the persistent CRT renderer singleton (`crtRenderer.ts`).
 *
 * Renders a bare `<div>` and, on mount, attaches the singleton's long-lived
 * canvas into it; on unmount, detaches. GL context, shader program, VAO, and
 * buffer persist across mounts, so dialog top-layer handoffs (one
 * `FilterOverlays` unmounting while another mounts) become cheap DOM
 * reparents rather than full pipeline rebuilds.
 *
 * Vignette is disabled entirely below the `sm` breakpoint and toned down
 * between `sm` and `lg`; the singleton handles that internally.
 *
 * Controlled by the `scanlineFilter1` user option. When that option flips to
 * `false`, this component unmounts; the singleton's idle-dispose logic then
 * releases the WebGL context until the option is re-enabled.
 */
export default function ScanlineFilter1({
  roll = false,
  noise = true,
}: ScanlineFilter1Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    attach(host);
    return () => detach(host);
  }, []);

  useEffect(() => {
    setRoll(roll);
  }, [roll]);

  useEffect(() => {
    setNoise(noise);
  }, [noise]);

  return <div ref={containerRef} />;
}
