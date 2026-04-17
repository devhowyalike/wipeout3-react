import { render, act, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EscapeNavigation } from "./EscapeNavigation";
import { Modal } from "./Modal";
import { useEscapeKey } from "./useEscapeKey";

vi.mock("@/hooks/useModal", () => ({
  useModal: () => ({ isModalEnabled: true, openPopup: vi.fn() }),
}));

function renderModal(props: Partial<React.ComponentPropsWithoutRef<typeof Modal>> = {}) {
  return render(
    <MemoryRouter>
      <EscapeNavigation>
        <Modal onClose={() => {}} {...props}>
          <p>Content</p>
        </Modal>
      </EscapeNavigation>
    </MemoryRouter>,
  );
}

function EscapeConsumer({ handler }: { handler: () => void }) {
  useEscapeKey(handler);
  return null;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Modal — accessible naming", () => {
  it('uses the provided label as aria-label', () => {
    renderModal({ label: "Gallery" });

    const dialog = document.querySelector("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Gallery");
  });

  it('falls back to "Dialog" when no label or labelledBy is provided', () => {
    renderModal();

    const dialog = document.querySelector("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Dialog");
  });

  it("uses labelledBy as aria-labelledby and omits aria-label", () => {
    renderModal({ labelledBy: "heading-id" });

    const dialog = document.querySelector("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "heading-id");
    expect(dialog).not.toHaveAttribute("aria-label");
  });

  it("sr-only span receives initial focus when no initialFocusRef is provided", () => {
    renderModal({ label: "Gallery" });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toBeInstanceOf(HTMLSpanElement);
    expect(document.activeElement).toHaveTextContent("Gallery");
    expect(document.activeElement).toHaveClass("sr-only");
  });

  it("unregisters its escape handler after closing itself", () => {
    const outerHandler = vi.fn();

    render(
      <MemoryRouter>
        <EscapeNavigation>
          <EscapeConsumer handler={outerHandler} />
          <Modal label="Gallery" onClose={() => {}}>
            <p>Content</p>
          </Modal>
        </EscapeNavigation>
      </MemoryRouter>,
    );

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    expect(document.querySelector("dialog")).toBeNull();

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    expect(outerHandler).toHaveBeenCalledTimes(1);
  });
});
