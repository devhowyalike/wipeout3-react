import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import FilterOverlays from "./FilterOverlays";
import { BaseDialog } from "./ui/BaseDialog";
import { OptionsContext } from "@/context/OptionsContext";
import { DEFAULT_OPTIONS } from "@/config/options";

// Replace the real `ScanlineFilter1` (which spins up a WebGL2 context) with a
// synchronous stub so we can simply count rendered instances. Each active
// `FilterOverlays` should produce exactly one `filter-instance` marker.
vi.mock("@/config/filterRegistry", () => ({
  FILTER_REGISTRY: [
    {
      option: "scanlineFilter1",
      component: () => <div data-testid="filter-instance" />,
      props: {},
    },
  ],
}));

function Providers({ children }: { children: ReactNode }) {
  return (
    <OptionsContext.Provider
      value={{ options: { ...DEFAULT_OPTIONS, scanlineFilter1: true } }}
    >
      {children}
    </OptionsContext.Provider>
  );
}

afterEach(() => {
  cleanup();
});

describe("FilterOverlays — dialog stack exclusivity", () => {
  it("renders exactly one instance at the root when no dialog is open", () => {
    render(<FilterOverlays />, { wrapper: Providers });

    const instances = screen.queryAllByTestId("filter-instance");
    expect(instances).toHaveLength(1);
    expect(instances[0].closest("dialog")).toBeNull();
  });

  it("yields the root and activates inside the dialog when one opens", () => {
    render(
      <>
        <FilterOverlays />
        <BaseDialog portal={false}>content</BaseDialog>
      </>,
      { wrapper: Providers },
    );

    const instances = screen.queryAllByTestId("filter-instance");
    expect(instances).toHaveLength(1);
    expect(instances[0].closest("dialog")).not.toBeNull();
  });

  // A nested modal mirrors real usage (e.g. `DiscardConfirmOverlay`
  // opening on top of `SettingsModal`): the inner dialog mounts *after*
  // the outer is already open, which is also the order in which the
  // browser promotes them into the top layer.
  function NestedApp({ showInner }: { showInner: boolean }) {
    return (
      <>
        <FilterOverlays />
        <BaseDialog portal={false} data-testid="outer-dialog">
          outer
          {showInner && (
            <BaseDialog portal={false} data-testid="inner-dialog">
              inner
            </BaseDialog>
          )}
        </BaseDialog>
      </>
    );
  }

  it("activates only in the top-most dialog when a nested dialog opens", () => {
    const { rerender } = render(<NestedApp showInner={false} />, {
      wrapper: Providers,
    });

    expect(
      screen.getByTestId("filter-instance").closest("dialog")?.dataset.testid,
    ).toBe("outer-dialog");

    rerender(<NestedApp showInner />);

    const instances = screen.queryAllByTestId("filter-instance");
    expect(instances).toHaveLength(1);
    expect(instances[0].closest("dialog")?.dataset.testid).toBe("inner-dialog");
  });

  it("reverts to the outer dialog when the inner dialog unmounts", () => {
    const { rerender } = render(<NestedApp showInner={false} />, {
      wrapper: Providers,
    });

    rerender(<NestedApp showInner />);
    expect(
      screen.getByTestId("filter-instance").closest("dialog")?.dataset.testid,
    ).toBe("inner-dialog");

    rerender(<NestedApp showInner={false} />);

    const instances = screen.queryAllByTestId("filter-instance");
    expect(instances).toHaveLength(1);
    expect(instances[0].closest("dialog")?.dataset.testid).toBe("outer-dialog");
  });

  it("reverts to the root when all dialogs close", () => {
    function App({ showDialog }: { showDialog: boolean }) {
      return (
        <>
          <FilterOverlays />
          {showDialog && <BaseDialog portal={false}>content</BaseDialog>}
        </>
      );
    }

    const { rerender } = render(<App showDialog />, { wrapper: Providers });
    expect(
      screen.getByTestId("filter-instance").closest("dialog"),
    ).not.toBeNull();

    rerender(<App showDialog={false} />);

    const instances = screen.queryAllByTestId("filter-instance");
    expect(instances).toHaveLength(1);
    expect(instances[0].closest("dialog")).toBeNull();
  });

  it("renders nothing if the option is disabled", () => {
    render(
      <OptionsContext.Provider
        value={{ options: { ...DEFAULT_OPTIONS, scanlineFilter1: false } }}
      >
        <FilterOverlays />
        <BaseDialog portal={false}>content</BaseDialog>
      </OptionsContext.Provider>,
    );

    expect(screen.queryAllByTestId("filter-instance")).toHaveLength(0);
  });
});
