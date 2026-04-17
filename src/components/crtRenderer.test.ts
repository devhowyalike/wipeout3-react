import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import * as crtRenderer from "./crtRenderer";

// `crtRenderer` needs a working `webgl2` context, which jsdom doesn't provide.
// Every test stubs `HTMLCanvasElement.prototype.getContext` with a fake GL
// implementation that records each call, so we can assert the singleton reuses
// (or rebuilds) the pipeline in the expected scenarios.
interface FakeGl {
  VERTEX_SHADER: number;
  FRAGMENT_SHADER: number;
  COMPILE_STATUS: number;
  LINK_STATUS: number;
  ARRAY_BUFFER: number;
  STATIC_DRAW: number;
  FLOAT: number;
  TRIANGLES: number;
  createShader: ReturnType<typeof vi.fn>;
  shaderSource: ReturnType<typeof vi.fn>;
  compileShader: ReturnType<typeof vi.fn>;
  getShaderParameter: ReturnType<typeof vi.fn>;
  getShaderInfoLog: ReturnType<typeof vi.fn>;
  deleteShader: ReturnType<typeof vi.fn>;
  createProgram: ReturnType<typeof vi.fn>;
  attachShader: ReturnType<typeof vi.fn>;
  linkProgram: ReturnType<typeof vi.fn>;
  getProgramParameter: ReturnType<typeof vi.fn>;
  getProgramInfoLog: ReturnType<typeof vi.fn>;
  deleteProgram: ReturnType<typeof vi.fn>;
  useProgram: ReturnType<typeof vi.fn>;
  createVertexArray: ReturnType<typeof vi.fn>;
  createBuffer: ReturnType<typeof vi.fn>;
  bindVertexArray: ReturnType<typeof vi.fn>;
  bindBuffer: ReturnType<typeof vi.fn>;
  bufferData: ReturnType<typeof vi.fn>;
  deleteVertexArray: ReturnType<typeof vi.fn>;
  deleteBuffer: ReturnType<typeof vi.fn>;
  getAttribLocation: ReturnType<typeof vi.fn>;
  getUniformLocation: ReturnType<typeof vi.fn>;
  enableVertexAttribArray: ReturnType<typeof vi.fn>;
  vertexAttribPointer: ReturnType<typeof vi.fn>;
  uniform1f: ReturnType<typeof vi.fn>;
  uniform2f: ReturnType<typeof vi.fn>;
  uniform3f: ReturnType<typeof vi.fn>;
  uniform4f: ReturnType<typeof vi.fn>;
  drawArrays: ReturnType<typeof vi.fn>;
  viewport: ReturnType<typeof vi.fn>;
  getExtension: ReturnType<typeof vi.fn>;
}

function createFakeGl(): FakeGl {
  return {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ""),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ""),
    deleteProgram: vi.fn(),
    useProgram: vi.fn(),
    createVertexArray: vi.fn(() => ({})),
    createBuffer: vi.fn(() => ({})),
    bindVertexArray: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    deleteVertexArray: vi.fn(),
    deleteBuffer: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn(() => ({})),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform3f: vi.fn(),
    uniform4f: vi.fn(),
    drawArrays: vi.fn(),
    viewport: vi.fn(),
    getExtension: vi.fn(() => ({ loseContext: vi.fn() })),
  };
}

let fakeGl: FakeGl;
let getContextSpy: MockInstance;

beforeEach(() => {
  fakeGl = createFakeGl();
  getContextSpy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation((type: string) => {
      if (type === "webgl2") return fakeGl as unknown as WebGL2RenderingContext;
      return null;
    });
});

afterEach(() => {
  // Reset module-level singleton state between tests; without this, a test
  // that leaves the singleton attached (or mid-init) would leak into the
  // next test's assertions.
  crtRenderer.dispose();
  getContextSpy.mockRestore();
});

describe("crtRenderer", () => {
  it("attach-detach-attach reuses the same canvas node", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    crtRenderer.attach(host);
    const canvas = host.querySelector("canvas");
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);

    crtRenderer.detach(host);
    expect(host.querySelector("canvas")).toBeNull();

    // Re-attach before the idle-dispose timer fires (synchronous: same task).
    crtRenderer.attach(host);
    expect(host.querySelector("canvas")).toBe(canvas);

    document.body.removeChild(host);
  });

  it("reparenting to a different host does not rebuild the GL program", () => {
    const hostA = document.createElement("div");
    const hostB = document.createElement("div");
    document.body.appendChild(hostA);
    document.body.appendChild(hostB);

    crtRenderer.attach(hostA);
    const canvas = hostA.querySelector("canvas");
    expect(canvas).toBeTruthy();

    const linkCountAfterFirst = fakeGl.linkProgram.mock.calls.length;

    crtRenderer.attach(hostB);
    expect(hostB.querySelector("canvas")).toBe(canvas);
    expect(hostA.querySelector("canvas")).toBeNull();
    expect(fakeGl.linkProgram.mock.calls.length).toBe(linkCountAfterFirst);

    document.body.removeChild(hostA);
    document.body.removeChild(hostB);
  });

  it("rebuilds GL resources on webglcontextrestored", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    crtRenderer.attach(host);
    const canvas = host.querySelector("canvas")!;
    const linkCountBefore = fakeGl.linkProgram.mock.calls.length;

    // Simulate context loss + restore. The singleton drops `resources` on
    // loss and rebuilds them on restore; the latter must link a fresh program.
    canvas.dispatchEvent(new Event("webglcontextlost"));
    canvas.dispatchEvent(new Event("webglcontextrestored"));

    expect(fakeGl.linkProgram.mock.calls.length).toBe(linkCountBefore + 1);

    document.body.removeChild(host);
  });

  it("recovers on a later attach after a failed initial attach", () => {
    // Simulate a transient init failure: the first `getContext("webgl2")`
    // call returns null, subsequent calls return a working fake GL. The
    // singleton must NOT latch that failure — a later attach should lazily
    // init a fresh pipeline.
    getContextSpy.mockReset();
    let callCount = 0;
    getContextSpy.mockImplementation((type: string) => {
      if (type !== "webgl2") return null;
      callCount += 1;
      if (callCount === 1) return null;
      return fakeGl as unknown as WebGL2RenderingContext;
    });

    const host = document.createElement("div");
    document.body.appendChild(host);

    crtRenderer.attach(host);
    expect(host.querySelector("canvas")).toBeNull();
    expect(fakeGl.linkProgram).not.toHaveBeenCalled();

    // Unmount path after a failed init must also be a no-op rather than
    // wedging the singleton: `currentHost` was never set, so `detach` just
    // bails out. The next attach is what proves recovery.
    crtRenderer.detach(host);

    crtRenderer.attach(host);
    expect(host.querySelector("canvas")).toBeInstanceOf(HTMLCanvasElement);
    expect(fakeGl.linkProgram).toHaveBeenCalledTimes(1);

    document.body.removeChild(host);
  });

  it("dispose() tears down cleanly and a subsequent attach re-inits", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    crtRenderer.attach(host);
    const canvas1 = host.querySelector("canvas");
    expect(canvas1).toBeTruthy();
    const linkCountBeforeDispose = fakeGl.linkProgram.mock.calls.length;

    crtRenderer.dispose();
    expect(host.querySelector("canvas")).toBeNull();
    expect(fakeGl.deleteProgram).toHaveBeenCalled();

    // After dispose, the next attach must lazy-init a brand-new pipeline
    // (different canvas node, fresh program link).
    crtRenderer.attach(host);
    const canvas2 = host.querySelector("canvas");
    expect(canvas2).toBeInstanceOf(HTMLCanvasElement);
    expect(canvas2).not.toBe(canvas1);
    expect(fakeGl.linkProgram.mock.calls.length).toBe(linkCountBeforeDispose + 1);

    document.body.removeChild(host);
  });
});
