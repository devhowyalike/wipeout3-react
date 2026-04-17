import { render, act, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { useRef } from "react";
import { useRouteChangeFocus } from "./useRouteChangeFocus";

type NavType = Parameters<typeof useRouteChangeFocus>[2];

afterEach(cleanup);

function TestPage({
  pathname,
  navType,
  hasHeading = true,
  children,
}: {
  pathname: string;
  navType: NavType;
  hasHeading?: boolean;
  children?: React.ReactNode;
}) {
  const mainRef = useRef<HTMLElement>(null);
  useRouteChangeFocus(mainRef, pathname, navType);

  return (
    <main ref={mainRef} tabIndex={-1}>
      {hasHeading && <h1>Page Title</h1>}
      {children ?? <a href="/other">Link</a>}
    </main>
  );
}

const PUSH = "PUSH" as NavType;
const POP = "POP" as NavType;

describe("useRouteChangeFocus", () => {
  it("PUSH navigation focuses the first <h1> inside <main>", () => {
    render(<TestPage pathname="/teams" navType={PUSH} />);

    const h1 = document.querySelector("h1");
    expect(document.activeElement).toBe(h1);
  });

  it("PUSH navigation falls back to <main> when no <h1> exists", () => {
    render(
      <TestPage pathname="/teams" navType={PUSH} hasHeading={false} />,
    );

    const main = document.querySelector("main");
    expect(document.activeElement).toBe(main);
  });

  it("POP navigation restores focus to the previously focused element", () => {
    const { rerender } = render(
      <TestPage pathname="/" navType={PUSH} />,
    );

    const link = document.querySelector("a")!;
    act(() => {
      link.focus();
      link.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });

    rerender(<TestPage pathname="/teams" navType={PUSH} />);
    rerender(<TestPage pathname="/" navType={POP} />);

    expect(document.activeElement).toBe(link);
  });

  it("POP falls back to <h1> when the previously focused element is gone", () => {
    const { rerender } = render(
      <TestPage pathname="/" navType={PUSH}>
        <button>Ephemeral</button>
      </TestPage>,
    );

    const btn = document.querySelector("button")!;
    act(() => {
      btn.focus();
      btn.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    });

    rerender(
      <TestPage pathname="/teams" navType={PUSH}>
        <button>Ephemeral</button>
      </TestPage>,
    );

    btn.remove();

    rerender(
      <TestPage pathname="/" navType={POP}>
        <button>Ephemeral</button>
      </TestPage>,
    );

    const h1 = document.querySelector("h1");
    expect(document.activeElement).toBe(h1);
  });
});
