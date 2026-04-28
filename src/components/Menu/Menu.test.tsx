import { Suspense, type ReactElement, type ReactNode } from "react";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Menu from "./Menu";
import type { MenuItem } from "@/types/Menu.types";
import { BaseDialog } from "../ui/BaseDialog";

vi.mock("@/hooks/useOptions", () => ({
  useOptions: () => ({ remapL: false }),
}));

vi.mock("@/utils/remapFontChars", () => ({
  remapL: (value: string) => value,
}));

vi.mock("../WipeoutLink/WipeoutLink", () => ({
  WipeoutLink: ({
    children,
    onClick,
    as = "link",
  }: {
    children: ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    as?: "button" | "link";
  }) =>
    as === "button" ? (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    ) : (
      <a href="/" onClick={onClick}>
        {children}
      </a>
    ),
}));

function TestModal({ onClose }: { onClose?: () => void }) {
  return (
    <div>
      <p>Dialog body</p>
      <button type="button" onClick={onClose}>
        Close dialog
      </button>
    </div>
  );
}

function FocusedTestModal({ onClose }: { onClose?: () => void }) {
  return (
    <BaseDialog portal={false} onClose={onClose} initialFocus="first-control">
      <button type="button" onClick={onClose}>
        Close dialog
      </button>
    </BaseDialog>
  );
}

function renderMenu(item: MenuItem) {
  return render(
    <BrowserRouter>
      <Menu items={[item]} prefetch={false} />
    </BrowserRouter>,
  );
}

function openModal() {
  fireEvent.click(screen.getByRole("button", { name: "Screenshots" }));
  act(() => {
    vi.runAllTimers();
  });
}

function closeModal() {
  fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
}

function createModalItem(content: ReactElement): MenuItem {
  return {
    id: "screenshots",
    label: "Screenshots",
    path: "",
    modalConfig: { content },
  } as MenuItem;
}

function captureModalHistorySpies() {
  const pushStateSpy = vi.spyOn(window.history, "pushState");
  const backSpy = vi.spyOn(window.history, "back");
  renderMenu(createModalItem(<TestModal />));
  openModal();
  closeModal();
  return { pushStateSpy, backSpy };
}

function assertFocusRestoration(content: ReactElement) {
  window.history.pushState({ idx: 1 }, "", "/game/previews");
  renderMenu(createModalItem(content));
  const opener = screen.getByRole("button", { name: "Screenshots" });
  opener.focus();
  openModal();
  expect(document.activeElement).toHaveTextContent("Close dialog");
  closeModal();
  act(() => {
    vi.runAllTimers();
  });
  expect(document.activeElement).toBe(opener);
}

beforeEach(() => {
  vi.useFakeTimers();
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

describe("Menu modal history", () => {
  it("does not push a synthetic entry during in-app navigation", () => {
    window.history.pushState({ idx: 1 }, "", "/game/previews");
    const { pushStateSpy, backSpy } = captureModalHistorySpies();
    expect(pushStateSpy).not.toHaveBeenCalled();
    expect(backSpy).not.toHaveBeenCalled();
  });

  it("falls back to a synthetic entry on the first history entry", () => {
    window.history.replaceState({ idx: 0 }, "", "/game/previews");
    const { pushStateSpy, backSpy } = captureModalHistorySpies();
    expect(pushStateSpy).toHaveBeenCalledTimes(1);
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it("uses forward navigation to cancel browser back when possible", () => {
    window.history.pushState({ idx: 1 }, "", "/game/previews");

    const forwardSpy = vi.spyOn(window.history, "forward");

    renderMenu(createModalItem(<TestModal />));
    openModal();

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.queryByText("Dialog body")).toBeNull();
    expect(forwardSpy).toHaveBeenCalledTimes(1);
  });

  it("returns focus to the opener after the modal closes", () => {
    assertFocusRestoration(<FocusedTestModal />);
  });

  it("returns focus when the modal content is wrapped in suspense", () => {
    assertFocusRestoration(
      <Suspense fallback={<div>Loading...</div>}>
        <FocusedTestModal />
      </Suspense>,
    );
  });
});
