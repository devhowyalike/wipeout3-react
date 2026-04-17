import { BREAKPOINT_SM, BREAKPOINT_LG } from "@/config/constants";
import {
  createPersistentFilterRenderer,
  type PersistentFilterRendererConfig,
} from "./persistentFilterRenderer";

/**
 * CRT scanline / noise / vignette filter for `ScanlineFilter1`.
 *
 * The long-lived singleton (canvas, GL context, RAF loop, attach/detach /
 * context-restore / idle-dispose wiring) lives in
 * `persistentFilterRenderer.ts`. This module wires up the CRT-specific
 * shader pair, resources, and per-frame hooks, then re-exports the
 * factory's lifecycle API plus two runtime toggles.
 *
 * To add a different scanline filter in the future, follow the same
 * pattern: create a sibling module, define its shaders and per-filter
 * hooks, call `createPersistentFilterRenderer(...)`, and register a matching
 * thin host component in `FILTER_REGISTRY`.
 */

const VIGNETTE_LG = {
  vignetting: 0.25,
  vignettingAlpha: 0.35,
  vignettingBlur: 0.3,
};
const VIGNETTE_SM = {
  vignetting: 0.15,
  vignettingAlpha: 0.25,
  vignettingBlur: 0.2,
};
const VIGNETTE_OFF = { vignetting: 0, vignettingAlpha: 0, vignettingBlur: 0 };

function pickVignette() {
  const w = window.innerWidth;
  if (w < BREAKPOINT_SM) return VIGNETTE_OFF;
  if (w < BREAKPOINT_LG) return VIGNETTE_SM;
  return VIGNETTE_LG;
}

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 vTextureCoord;
void main() {
  vTextureCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// Ported from pixi-filters CRTFilter (MIT). Input texture sampling is
// replaced with a constant white base since the original pipeline fed a
// full-screen white fill into the filter before compositing with
// mix-blend-mode: multiply. Curvature is fixed to 0 (unused by this site),
// which lets the interlace branch collapse to the _c=1 path.
const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform vec4 uLine;
uniform vec2 uNoise;
uniform vec3 uVignette;
uniform float uSeed;
uniform float uTime;
uniform vec2 uDimensions;

const float SQRT_2 = 1.414213;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float vignette(vec2 coord) {
  float outter = SQRT_2 - uVignette[0] * SQRT_2;
  vec2 dir = vec2(0.5) - coord;
  dir.y *= uDimensions.y / uDimensions.x;
  float darker = clamp(
    (outter - length(dir) * SQRT_2) / (0.00001 + uVignette[2] * SQRT_2),
    0.0,
    1.0
  );
  return darker + (1.0 - darker) * (1.0 - uVignette[1]);
}

float noise(vec2 coord) {
  vec2 pixelCoord = coord * uDimensions;
  pixelCoord.x = floor(pixelCoord.x / uNoise[1]);
  pixelCoord.y = floor(pixelCoord.y / uNoise[1]);
  return (rand(pixelCoord * uNoise[1] * uSeed) - 0.5) * uNoise[0];
}

vec3 interlaceLines(vec3 co, vec2 coord) {
  vec3 color = co;

  float lineWidth = uLine[1];
  float lineContrast = uLine[2];
  float verticalLine = uLine[3];

  vec2 dir = coord - 0.5;
  float v = verticalLine > 0.5 ? dir.x * uDimensions.x : dir.y * uDimensions.y;
  v *= min(1.0, 2.0 / lineWidth);
  float j = 1.0 + cos(v * 1.2 - uTime) * 0.5 * lineContrast;
  color *= j;

  float segment = verticalLine > 0.5
    ? mod((dir.x + 0.5) * uDimensions.x, 4.0)
    : mod((dir.y + 0.5) * uDimensions.y, 4.0);
  color *= 0.99 + ceil(segment) * 0.015;

  return color;
}

void main() {
  finalColor = vec4(1.0);

  if (uNoise[0] > 0.0 && uNoise[1] > 0.0) {
    float n = noise(vTextureCoord);
    finalColor += vec4(n, n, n, 0.0);
  }

  if (uVignette[0] > 0.0) {
    float v = vignette(vTextureCoord);
    finalColor *= vec4(v, v, v, 1.0);
  }

  if (uLine[1] > 0.0) {
    finalColor = vec4(interlaceLines(finalColor.rgb, vTextureCoord), finalColor.a);
  }
}`;

interface CrtResources {
  vao: WebGLVertexArrayObject;
  buffer: WebGLBuffer;
  uLine: WebGLUniformLocation;
  uNoise: WebGLUniformLocation;
  uVignette: WebGLUniformLocation;
  uSeed: WebGLUniformLocation;
  uTime: WebGLUniformLocation;
  uDimensions: WebGLUniformLocation;
}

// Runtime toggles live in module scope so `drawFrame` can read the latest
// value without the factory having to know about CRT-specific state.
// Survives context loss/restore (only GL-side resources are rebuilt).
let time = 0;
let rollEnabled = false;
let noiseEnabled = true;

const config: PersistentFilterRendererConfig<CrtResources> = {
  vertexShader: VERTEX_SHADER,
  fragmentShader: FRAGMENT_SHADER,

  setupResources(gl, program) {
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!vao || !buffer) {
      if (vao) gl.deleteVertexArray(vao);
      if (buffer) gl.deleteBuffer(buffer);
      return null;
    }
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Single oversized triangle covers the whole clip-space quad.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    // `getAttribLocation` returns -1 and `getUniformLocation` returns null
    // when a symbol is missing or optimised out. Passing -1 to
    // enableVertexAttribArray / vertexAttribPointer raises GL_INVALID_VALUE,
    // and a null uniform location silently no-ops.
    const posLoc = gl.getAttribLocation(program, "a_position");
    if (posLoc === -1) {
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      return null;
    }
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uLine = gl.getUniformLocation(program, "uLine");
    const uNoise = gl.getUniformLocation(program, "uNoise");
    const uVignette = gl.getUniformLocation(program, "uVignette");
    const uSeed = gl.getUniformLocation(program, "uSeed");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uDimensions = gl.getUniformLocation(program, "uDimensions");
    if (
      uLine === null ||
      uNoise === null ||
      uVignette === null ||
      uSeed === null ||
      uTime === null ||
      uDimensions === null
    ) {
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      return null;
    }

    // curvature=0, lineWidth=2, lineContrast=0.25, verticalLine=0
    gl.uniform4f(uLine, 0, 2, 0.25, 0);
    // noise intensity, noise grain size
    gl.uniform2f(uNoise, 0.12, 1.2);

    return {
      vao,
      buffer,
      uLine,
      uNoise,
      uVignette,
      uSeed,
      uTime,
      uDimensions,
    };
  },

  onResize(gl, resources, cssW, cssH) {
    // Scanline / noise density is computed in CSS pixels so it stays
    // consistent across devices; the canvas backing store is already
    // DPR-scaled so the rendered output remains crisp.
    gl.uniform2f(resources.uDimensions, cssW, cssH);
    const v = pickVignette();
    gl.uniform3f(
      resources.uVignette,
      v.vignetting,
      v.vignettingAlpha,
      v.vignettingBlur,
    );
  },

  drawFrame(gl, resources) {
    if (rollEnabled) time += 0.04;
    gl.uniform1f(resources.uTime, time);
    gl.uniform1f(resources.uSeed, noiseEnabled ? Math.random() : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  },

  releaseResources(gl, resources) {
    gl.deleteBuffer(resources.buffer);
    gl.deleteVertexArray(resources.vao);
  },
};

const renderer = createPersistentFilterRenderer(config);

export const attach = renderer.attach;
export const detach = renderer.detach;
export const dispose = renderer.dispose;

/** Toggle the scanline-roll animation (advances `uTime` per frame). */
export function setRoll(value: boolean): void {
  rollEnabled = value;
}

/** Toggle the noise-grain animation (randomises `uSeed` per frame). */
export function setNoise(value: boolean): void {
  noiseEnabled = value;
}

// Vite HMR: tear down the singleton before the module is replaced.
// Without this, hot updates would orphan a canvas + GL context + resize
// listener and leave duplicate RAF loops running against dead module state.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    dispose();
  });
}
