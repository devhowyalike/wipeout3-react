interface ModalCloseButtonProps {
  onClick: () => void;
  label?: string;
}

/** Absolutely-positioned "×" button anchored for closing modal dialogs. */
export function ModalCloseButton({
  onClick,
  label = "Close modal",
}: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-6 z-50 cursor-pointer text-nav hover:text-nav-hover font-wipeout3 text-5xl pointer-events-auto focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-page"
      aria-label={label}
    >
      ×
    </button>
  );
}
