import { render, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, afterEach } from "vitest";
import { EscapeNavigation } from "./EscapeNavigation";
import { useEscapeKey } from "./useEscapeKey";

afterEach(cleanup);

function EscapeConsumer({ handler }: { handler: () => void }) {
  useEscapeKey(handler);
  return null;
}

function pressEscape() {
  fireEvent.keyDown(window, { key: "Escape" });
}

function dispatchEscapeEvent() {
  const event = new KeyboardEvent("keydown", {
    key: "Escape",
    bubbles: true,
    cancelable: true,
  });
  const preventDefaultSpy = vi.spyOn(event, "preventDefault");
  window.dispatchEvent(event);
  return preventDefaultSpy;
}

describe("EscapeNavigation — stacked escape handling", () => {
  it("invokes the most recently registered handler", () => {
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    render(
      <MemoryRouter>
        <EscapeNavigation>
          <EscapeConsumer handler={handlerA} />
          <EscapeConsumer handler={handlerB} />
        </EscapeNavigation>
      </MemoryRouter>,
    );

    pressEscape();

    expect(handlerB).toHaveBeenCalledTimes(1);
    expect(handlerA).not.toHaveBeenCalled();
  });

  it("falls through to the outer handler when the inner unmounts", () => {
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    function InnerOverlay({ show }: { show: boolean }) {
      return show ? <EscapeConsumer handler={handlerB} /> : null;
    }

    const { rerender } = render(
      <MemoryRouter>
        <EscapeNavigation>
          <EscapeConsumer handler={handlerA} />
          <InnerOverlay show={true} />
        </EscapeNavigation>
      </MemoryRouter>,
    );

    pressEscape();
    expect(handlerB).toHaveBeenCalledTimes(1);
    expect(handlerA).not.toHaveBeenCalled();

    rerender(
      <MemoryRouter>
        <EscapeNavigation>
          <EscapeConsumer handler={handlerA} />
          <InnerOverlay show={false} />
        </EscapeNavigation>
      </MemoryRouter>,
    );

    pressEscape();
    expect(handlerA).toHaveBeenCalledTimes(1);
  });

  it("navigates back when the stack is empty and not on the home route", () => {
    render(
      <MemoryRouter initialEntries={["/teams"]}>
        <EscapeNavigation>{null}</EscapeNavigation>
      </MemoryRouter>,
    );

    // With an empty handler stack and a non-home pathname,
    // Escape should call navigate(-1). We verify indirectly by
    // confirming the event was preventDefault'd.
    expect(dispatchEscapeEvent()).toHaveBeenCalled();
  });

  it("does nothing when the stack is empty on the home route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <EscapeNavigation>{null}</EscapeNavigation>
      </MemoryRouter>,
    );

    expect(dispatchEscapeEvent()).not.toHaveBeenCalled();
  });
});
