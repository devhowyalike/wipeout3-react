import { useEffect, useRef } from "react";
import { Application, Container, Graphics } from "pixi.js";
import { CRTFilter } from "pixi-filters/crt";
import { BREAKPOINT_SM, BREAKPOINT_LG } from "@/config/constants";

/** Vignette values tuned for large screens. */
const VIGNETTE_LG = {
  vignetting: 0.35,
  vignettingAlpha: 0.5,
  vignettingBlur: 0.3,
};
/** Toned-down vignette for smaller viewports where edges crowd the content. */
const VIGNETTE_SM = {
  vignetting: 0.15,
  vignettingAlpha: 0.25,
  vignettingBlur: 0.2,
};
/** No vignette below the md breakpoint. */
const VIGNETTE_OFF = { vignetting: 0, vignettingAlpha: 0, vignettingBlur: 0 };

function applyVignette(filter: CRTFilter) {
  const w = window.innerWidth;
  const v =
    w < BREAKPOINT_SM
      ? VIGNETTE_OFF
      : w < BREAKPOINT_LG
        ? VIGNETTE_SM
        : VIGNETTE_LG;
  filter.vignetting = v.vignetting;
  filter.vignettingAlpha = v.vignettingAlpha;
  filter.vignettingBlur = v.vignettingBlur;
}

interface ScanlineFilter1Props {
  /** Animate the scanline roll by incrementing `filter.time` each frame. Defaults to `false`. */
  roll?: boolean;
  /** Randomise `filter.seed` each frame to animate the noise grain. Defaults to `true`. */
  noise?: boolean;
}

/**
 * Full-screen PixiJS canvas that renders a CRT monitor effect (scanlines,
 * noise, vignette) over the entire site. Renders at the viewport's native
 * resolution so scanlines are crisp. A white fill is processed by the CRT
 * filter and composited over the page with `mix-blend-mode: multiply`.
 *
 * Vignette is disabled entirely below the `sm` breakpoint and toned down
 * between `sm` and `lg` to avoid overwhelming small screens.
 *
 * Controlled by the `scanlineFilter1` user option.
 */
export default function ScanlineFilter1({ roll = false, noise = true }: ScanlineFilter1Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef(roll);
  const noiseRef = useRef(noise);
  rollRef.current = roll;
  noiseRef.current = noise;

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let initializedApp: Application | null = null;
    let onResize: (() => void) | null = null;
    const container = containerRef.current;

    const filter = new CRTFilter({
      lineWidth: 2,
      lineContrast: 0.25,
      noise: 0.12,
      noiseSize: 1.2,
      curvature: 0,
      ...VIGNETTE_LG,
    });
    applyVignette(filter);

    (async () => {
      const app = new Application();

      await app.init({
        backgroundAlpha: 0,
        antialias: false,
        autoDensity: true,
        resolution: window.devicePixelRatio ?? 1,
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if (cancelled) {
        app.destroy(true);
        return;
      }

      initializedApp = app;

      app.canvas.style.position = "fixed";
      app.canvas.style.inset = "0";
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.canvas.style.pointerEvents = "none";
      app.canvas.style.zIndex = "50";
      app.canvas.style.mixBlendMode = "multiply";
      container.appendChild(app.canvas);

      const fill = new Graphics()
        .rect(0, 0, app.screen.width, app.screen.height)
        .fill({ color: 0xffffff, alpha: 1 });

      const filterContainer = new Container();
      filterContainer.addChild(fill);
      filterContainer.filters = [filter];
      app.stage.addChild(filterContainer);

      onResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        fill
          .clear()
          .rect(0, 0, app.screen.width, app.screen.height)
          .fill({ color: 0xffffff, alpha: 1 });
        applyVignette(filter);
      };
      window.addEventListener("resize", onResize);

      app.ticker.add(() => {
        if (rollRef.current) filter.time += 0.08;
        if (noiseRef.current) filter.seed = Math.random();
      });
    })();

    return () => {
      cancelled = true;
      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
      if (initializedApp) {
        initializedApp.destroy(true, { children: true });
        initializedApp = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
}
