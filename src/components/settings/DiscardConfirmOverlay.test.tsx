import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EscapeNavigation } from "../EscapeNavigation";
import { DiscardConfirmOverlay } from "./DiscardConfirmOverlay";

function renderOverlay(
  props: Partial<{ onDiscard: () => void; onEdit: () => void }> = {},
) {
  const onDiscard = props.onDiscard ?? vi.fn();
  const onEdit = props.onEdit ?? vi.fn();

  return {
    onDiscard,
    onEdit,
    ...render(
      <MemoryRouter>
        <EscapeNavigation>
          <DiscardConfirmOverlay onDiscard={onDiscard} onEdit={onEdit} />
        </EscapeNavigation>
      </MemoryRouter>,
    ),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("DiscardConfirmOverlay — pointer & keyboard interaction", () => {
  it("calls onDiscard when Discard is clicked", () => {
    const { onDiscard } = renderOverlay();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    fireEvent.click(screen.getByRole("button", { name: /discard/i }));

    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit when Edit is clicked", () => {
    const { onEdit } = renderOverlay();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("Discard button is focusable and enabled for keyboard activation", () => {
    renderOverlay();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const button = screen.getByRole("button", { name: /discard/i });
    button.focus();

    expect(document.activeElement).toBe(button);
    expect(button).toBeEnabled();
  });

  it("Edit button is focusable and enabled for keyboard activation", () => {
    renderOverlay();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const button = screen.getByRole("button", { name: /edit/i });
    button.focus();

    expect(document.activeElement).toBe(button);
    expect(button).toBeEnabled();
  });

  it("focuses the Edit (safe-action) button on open", () => {
    renderOverlay();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: /edit/i }),
    );
  });
});
