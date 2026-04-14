import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useModalHistory } from "./useModalHistory";

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

function renderModalHistory(isOpen: boolean, onClose = vi.fn()) {
  return {
    onClose,
    ...renderHook(
      ({ isOpen, onClose }) => useModalHistory({ isOpen, onClose }),
      { initialProps: { isOpen, onClose } },
    ),
  };
}

describe("useModalHistory", () => {
  describe("intercept mode (in-app navigation, idx > 0)", () => {
    beforeEach(() => {
      window.history.pushState({ idx: 1 }, "", "/game/previews");
    });

    it("does not push a synthetic history entry", () => {
      const pushSpy = vi.spyOn(window.history, "pushState");
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));

      expect(pushSpy).not.toHaveBeenCalled();
      document.body.removeChild(trigger);
    });

    it("does not call history.back on requestClose", () => {
      const backSpy = vi.spyOn(window.history, "back");
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      act(() => result.current.requestClose());

      expect(backSpy).not.toHaveBeenCalled();
      document.body.removeChild(trigger);
    });

    it("closes and calls forward() on popstate", () => {
      const forwardSpy = vi.spyOn(window.history, "forward");
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(forwardSpy).toHaveBeenCalledTimes(1);
      document.body.removeChild(trigger);
    });

    it("ignores the popstate caused by its own forward() call", () => {
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      expect(onClose).toHaveBeenCalledTimes(1);

      onClose.mockClear();
      rerender({ isOpen: true, onClose });

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      expect(onClose).not.toHaveBeenCalled();
      document.body.removeChild(trigger);
    });
  });

  describe("synthetic mode (first entry, idx === 0)", () => {
    beforeEach(() => {
      window.history.replaceState({ idx: 0 }, "", "/game/previews");
    });

    it("pushes a synthetic history entry on prepareOpen", () => {
      const pushSpy = vi.spyOn(window.history, "pushState");
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));

      expect(pushSpy).toHaveBeenCalledWith({ modal: true }, "");
      document.body.removeChild(trigger);
    });

    it("calls history.back on requestClose to pop the synthetic entry", () => {
      const backSpy = vi.spyOn(window.history, "back");
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      act(() => result.current.requestClose());

      expect(backSpy).toHaveBeenCalledTimes(1);
      document.body.removeChild(trigger);
    });

    it("closes on popstate without calling forward()", () => {
      const forwardSpy = vi.spyOn(window.history, "forward");
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(forwardSpy).not.toHaveBeenCalled();
      document.body.removeChild(trigger);
    });
  });

  describe("focus restoration", () => {
    it("restores focus to the trigger element on requestClose", () => {
      window.history.pushState({ idx: 1 }, "", "/game/previews");

      const trigger = document.createElement("button");
      trigger.textContent = "Open";
      document.body.appendChild(trigger);
      trigger.focus();

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      const other = document.createElement("input");
      document.body.appendChild(other);
      other.focus();
      expect(document.activeElement).toBe(other);

      act(() => result.current.requestClose());
      act(() => {
        vi.runAllTimers();
      });

      expect(document.activeElement).toBe(trigger);
      document.body.removeChild(other);
      document.body.removeChild(trigger);
    });

    it("restores focus on popstate-triggered close", () => {
      window.history.pushState({ idx: 1 }, "", "/game/previews");

      const trigger = document.createElement("button");
      trigger.textContent = "Open";
      document.body.appendChild(trigger);

      const { result, rerender, onClose } = renderModalHistory(false);
      act(() => result.current.prepareOpen(trigger));
      rerender({ isOpen: true, onClose });

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      act(() => {
        vi.runAllTimers();
      });

      expect(document.activeElement).toBe(trigger);
      document.body.removeChild(trigger);
    });
  });

  describe("no-op when closed", () => {
    it("does not attach a popstate listener when isOpen is false", () => {
      const addSpy = vi.spyOn(window, "addEventListener");

      renderModalHistory(false);

      const popstateCalls = addSpy.mock.calls.filter(
        ([event]) => event === "popstate",
      );
      expect(popstateCalls).toHaveLength(0);
    });
  });
});
