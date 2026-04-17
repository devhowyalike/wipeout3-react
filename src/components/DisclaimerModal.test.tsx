import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { EscapeNavigation } from "./EscapeNavigation";
import { DisclaimerModal } from "./DisclaimerModal";

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <MemoryRouter>
      <EscapeNavigation>{ui}</EscapeNavigation>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe("DisclaimerModal", () => {
  it("returns focus to the previously focused link when Escape is pressed", () => {
    vi.useFakeTimers();

    const triggerLink = document.createElement("a");
    triggerLink.href = "#";
    triggerLink.textContent = "Trigger";
    document.body.appendChild(triggerLink);
    triggerLink.focus();
    expect(document.activeElement).toBe(triggerLink);

    renderWithProviders(<DisclaimerModal />);

    expect(
      screen.getByRole("heading", { name: /preservation project/i }),
    ).toBeInTheDocument();

    // useShowModal schedules a 50 ms timer to move focus into the dialog.
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Simulate pressing Escape — picked up by EscapeNavigation's keydown listener
    // which calls handleClose, unmounting the dialog and triggering focus restore.
    fireEvent.keyDown(window, { key: "Escape" });

    // useShowModal restores focus inside a requestAnimationFrame callback.
    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(triggerLink);

    document.body.removeChild(triggerLink);
    vi.useRealTimers();
  });
});
