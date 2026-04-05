type InputModality = "keyboard" | "pointer";

let lastInputModality: InputModality = "pointer";
let hasBoundInputModalityListeners = false;

/**
 * Starts tracking whether the user's last interaction was via keyboard or
 * pointer. Safe to call multiple times; listeners are bound only once.
 */
export function bindInputModalityListeners(): void {
  if (hasBoundInputModalityListeners || typeof window === "undefined") return;

  const handlePointerDown = () => {
    lastInputModality = "pointer";
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    lastInputModality = "keyboard";
  };

  window.addEventListener("pointerdown", handlePointerDown, true);
  window.addEventListener("keydown", handleKeyDown, true);
  hasBoundInputModalityListeners = true;
}

/** Returns the most recently observed input modality. */
export function getLastInputModality(): InputModality {
  return lastInputModality;
}

// Start tracking as soon as this module is loaded so the interaction that opens
// a modal is observed before `useShowModal()` runs.
bindInputModalityListeners();
