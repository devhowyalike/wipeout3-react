import { render, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { BaseDialog } from "@/components/ui/BaseDialog";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function DialogFixture(
  props: Omit<
    React.ComponentPropsWithoutRef<typeof BaseDialog>,
    "portal" | "children"
  > & { children?: React.ReactNode },
) {
  const { children, ...rest } = props;
  return (
    <BaseDialog portal={false} {...rest}>
      {children ?? <button>inside</button>}
    </BaseDialog>
  );
}

describe("useShowModal — focus management", () => {
  it('initialFocus="first-control" focuses the first interactive element', () => {
    render(
      <DialogFixture initialFocus="first-control">
        <button>First</button>
        <button>Second</button>
      </DialogFixture>,
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toBeInstanceOf(HTMLButtonElement);
    expect(document.activeElement).toHaveTextContent("First");
  });

  it('initialFocus="safe-action" focuses the [data-dialog-safe-action] element', () => {
    render(
      <DialogFixture initialFocus="safe-action">
        <button>Discard</button>
        <button data-dialog-safe-action>Edit</button>
      </DialogFixture>,
    );

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it('initialFocus="dialog" keeps focus on the dialog container', () => {
    render(<DialogFixture initialFocus="dialog" />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement?.tagName).toBe("DIALOG");
  });

  it("initialFocusRef overrides strategy and focuses the explicit element", () => {
    const ref = { current: null as HTMLSpanElement | null };

    function WithRef() {
      return (
        <BaseDialog portal={false} initialFocusRef={ref}>
          <span ref={ref} tabIndex={-1}>
            Target
          </span>
          <button>Decoy</button>
        </BaseDialog>
      );
    }

    render(<WithRef />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).toHaveTextContent("Target");
  });

  it("blurs the opener before the dialog opens", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open";
    document.body.appendChild(trigger);
    trigger.focus();

    const blurSpy = vi.fn();
    trigger.addEventListener("blur", blurSpy);

    render(<DialogFixture initialFocus="dialog" />);

    expect(blurSpy).toHaveBeenCalled();

    trigger.removeEventListener("blur", blurSpy);
    document.body.removeChild(trigger);
  });

  it("restores focus to the opener on close", () => {
    const opener = document.createElement("a");
    opener.href = "#";
    opener.textContent = "Opener";
    document.body.appendChild(opener);
    opener.focus();

    const { unmount } = render(<DialogFixture initialFocus="first-control" />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(document.activeElement).not.toBe(opener);

    unmount();

    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(opener);

    document.body.removeChild(opener);
  });

  it("falls back to <main> when the opener has been removed from the DOM", () => {
    const main = document.createElement("main");
    main.tabIndex = -1;
    document.body.appendChild(main);

    const opener = document.createElement("button");
    opener.textContent = "Ephemeral";
    document.body.appendChild(opener);
    opener.focus();

    const { unmount } = render(<DialogFixture initialFocus="first-control" />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    document.body.removeChild(opener);

    unmount();

    act(() => {
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(main);

    document.body.removeChild(main);
  });
});
