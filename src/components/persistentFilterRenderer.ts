/**
 * Factory for persistent WebGL2 filter-overlay renderers.
 *
 * Encapsulates the machinery every filter in this project needs:
 * - A single long-lived canvas + GL context (survives React unmounts).
 * - `attach(host)` / `detach(host)` reparent semantics so dialog top-layer
 *   handoffs are cheap DOM moves instead of full pipeline rebuilds.
 * - Idle-dispose on detach so an options-driven toggle-off releases the
 *   context, while a dialog handoff (which re-attaches synchronously) does
 *   not trigger a rebuild.
 * - `webglcontextlost` / `webglcontextrestored` recovery — rebuilds the
 *   program and per-filter resources on restore and resumes the loop.
 * - DPR-aware resize handling.
 *
 * Each filter supplies its own shader pair and per-filter hooks via
 * `PersistentFilterRendererConfig`. Runtime state that changes between
 * frames (toggles like `roll`/`noise`) is held in the caller's module
 * scope and read inside `drawFrame`.
 *
 * Canvas styling defaults to a fullscreen overlay compositing via
 * `mix-blend-mode: multiply` — the invariant every existing filter relies
 * on. The canvas uses `position: fixed` and, by assumption, lives inside
 * ancestors that never establish a containing block for fixed-position
 * descendants (no `transform`, `filter`, `perspective`, `contain:
 * layout/paint` on `<body>`, `<dialog>`, or the portal target). If that
 * assumption breaks for a given filter, pass custom `canvasStyle`.
 */

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vs: string,
  fs: string,
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");
  const vShader = compileShader(gl, gl.VERTEX_SHADER, vs);
  const fShader = compileShader(gl, gl.FRAGMENT_SHADER, fs);
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  gl.deleteShader(vShader);
  gl.deleteShader(fShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${log}`);
  }
  return program;
}

export interface PersistentFilterRendererConfig<U> {
  /** GLSL 300 es vertex shader source. */
  vertexShader: string;
  /** GLSL 300 es fragment shader source. */
  fragmentShader: string;
  /**
   * Called after the program links. Create VAOs, buffers, look up uniform
   * locations, and seed static uniforms. Return an opaque resources object
   * that `onResize`, `drawFrame`, and `releaseResources` receive; return
   * `null` to abort init (e.g. a missing attribute or uniform).
   *
   * Runs again on `webglcontextrestored` so any GL objects referenced must
   * live entirely inside the returned value (the factory discards the
   * previous one before calling).
   */
  setupResources(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
  ): U | null;
  /**
   * Push dimension-derived uniforms. Fires on init, on `window` resize
   * after the viewport and backing store are updated, and on
   * `webglcontextrestored`.
   */
  onResize?(
    gl: WebGL2RenderingContext,
    resources: U,
    cssW: number,
    cssH: number,
  ): void;
  /** Per-RAF-frame hook: push dynamic uniforms and issue draw calls. */
  drawFrame(gl: WebGL2RenderingContext, resources: U): void;
  /**
   * Release GL objects held by `resources`. Called on dispose and on
   * `webglcontextlost` (though the GL objects are already invalid then;
   * a no-op or best-effort delete is fine). The factory deletes the
   * program itself.
   */
  releaseResources(gl: WebGL2RenderingContext, resources: U): void;
  /** Canvas style overrides layered on top of the fullscreen overlay defaults. */
  canvasStyle?: Partial<CSSStyleDeclaration>;
}

interface PersistentFilterRenderer {
  /**
   * Attach the canvas to `host`. Lazily initialises on first call, then
   * reparents on subsequent calls (no GL rebuild).
   */
  attach(host: HTMLElement): void;
  /**
   * Detach from `host` if currently attached there. Pauses the RAF loop
   * and removes the canvas from the DOM; schedules an idle dispose that
   * a same-task `attach` will cancel.
   */
  detach(host: HTMLElement): void;
  /**
   * Full teardown: stop RAF, remove listeners, release resources + program,
   * force `WEBGL_lose_context`, remove the canvas, and reset state so the
   * next `attach` lazy-inits from scratch. Required by Vitest and HMR.
   */
  dispose(): void;
}

const DEFAULT_CANVAS_STYLE: Partial<CSSStyleDeclaration> = {
  position: "fixed",
  inset: "0",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: "50",
  mixBlendMode: "multiply",
};

export function createPersistentFilterRenderer<U>(
  config: PersistentFilterRendererConfig<U>,
): PersistentFilterRenderer {
  let canvas: HTMLCanvasElement | null = null;
  let gl: WebGL2RenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let resources: U | null = null;
  let currentHost: HTMLElement | null = null;
  let rafId = 0;
  let running = false;
  let idleDisposeTimer: ReturnType<typeof setTimeout> | null = null;
  let initialized = false;
  let onResizeListener: (() => void) | null = null;
  let onContextLost: ((e: Event) => void) | null = null;
  let onContextRestored: (() => void) | null = null;

  function createCanvas(): HTMLCanvasElement {
    const c = document.createElement("canvas");
    Object.assign(c.style, DEFAULT_CANVAS_STYLE, config.canvasStyle ?? {});
    return c;
  }

  // Link a fresh program and hand it to the filter to build its per-GL
  // resources. Called on first init and on `webglcontextrestored`, where
  // every prior GL handle is invalid and must be recreated.
  function buildPipeline(
    glCtx: WebGL2RenderingContext,
  ): { program: WebGLProgram; resources: U } | null {
    let prog: WebGLProgram;
    try {
      prog = createProgram(glCtx, config.vertexShader, config.fragmentShader);
    } catch {
      return null;
    }
    glCtx.useProgram(prog);
    const res = config.setupResources(glCtx, prog);
    if (res === null) {
      glCtx.deleteProgram(prog);
      return null;
    }
    return { program: prog, resources: res };
  }

  function applyResize() {
    if (!gl || !canvas || !resources) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const w = Math.max(1, Math.floor(cssW * dpr));
    const h = Math.max(1, Math.floor(cssH * dpr));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    config.onResize?.(gl, resources, cssW, cssH);
  }

  function frame() {
    if (!running || !gl || !resources) return;
    config.drawFrame(gl, resources);
    rafId = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (running || !gl || !resources) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }

  function stopLoop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function ensureInitialized(): boolean {
    if (initialized) return true;

    const c = createCanvas();
    const glCtx = c.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    // Transient failures (context creation, shader compile/link, resource
    // setup) are deliberately not latched: leaving `initialized` false lets
    // the next `attach` retry from scratch. Caching a failure here would
    // disable the filter for the rest of the page lifetime, since a failed
    // init never assigns `currentHost` and therefore never reaches the
    // `detach` -> `dispose` reset path.
    if (!glCtx) return false;

    const built = buildPipeline(glCtx);
    if (!built) return false;

    canvas = c;
    gl = glCtx;
    program = built.program;
    resources = built.resources;

    onResizeListener = applyResize;
    window.addEventListener("resize", onResizeListener);

    onContextLost = (e: Event) => {
      // Prevent the default (no-automatic-restore) behaviour so the browser
      // will fire `webglcontextrestored` once GPU resources are available.
      e.preventDefault();
      stopLoop();
      // The old GL objects are invalid. Drop references so any stray draw
      // bails out and the next restore rebuilds into fresh handles.
      resources = null;
      program = null;
    };
    onContextRestored = () => {
      if (!gl || !canvas) return;
      const rebuilt = buildPipeline(gl);
      if (!rebuilt) {
        // Restore succeeded but rebuild failed: the GL context is alive but
        // has no program/resources. Tear everything down so the next
        // `attach` lazy-inits fresh instead of reusing a half-built pipeline.
        dispose();
        return;
      }
      program = rebuilt.program;
      resources = rebuilt.resources;
      applyResize();
      if (currentHost) startLoop();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    applyResize();
    initialized = true;
    return true;
  }

  function dispose(): void {
    stopLoop();
    if (idleDisposeTimer !== null) {
      clearTimeout(idleDisposeTimer);
      idleDisposeTimer = null;
    }
    if (onResizeListener) {
      window.removeEventListener("resize", onResizeListener);
    }
    if (canvas) {
      if (onContextLost) {
        canvas.removeEventListener("webglcontextlost", onContextLost);
      }
      if (onContextRestored) {
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
      }
    }
    if (gl && resources) config.releaseResources(gl, resources);
    if (gl && program) gl.deleteProgram(program);
    if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);

    canvas = null;
    gl = null;
    program = null;
    resources = null;
    currentHost = null;
    running = false;
    rafId = 0;
    initialized = false;
    onResizeListener = null;
    onContextLost = null;
    onContextRestored = null;
  }

  function attach(host: HTMLElement): void {
    if (idleDisposeTimer !== null) {
      clearTimeout(idleDisposeTimer);
      idleDisposeTimer = null;
    }
    if (!ensureInitialized() || !canvas) return;
    if (canvas.parentNode !== host) host.appendChild(canvas);
    currentHost = host;
    startLoop();
  }

  function detach(host: HTMLElement): void {
    if (currentHost !== host) return;
    stopLoop();
    if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
    currentHost = null;
    // A dialog handoff re-attaches within the same synchronous commit and
    // cancels this timer before it fires. An options-toggle-off detach
    // leaves the timer running, and the filter fully disposes so a
    // disabled effect never holds a WebGL context.
    idleDisposeTimer = setTimeout(() => {
      idleDisposeTimer = null;
      if (currentHost === null) dispose();
    }, 0);
  }

  return { attach, detach, dispose };
}
