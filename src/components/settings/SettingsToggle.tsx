interface SettingsToggleProps {
  checked: boolean;
  onToggle: () => void;
}

/**
 * Accessible switch-styled control used beside accordion triggers in the options modal.
 */
export function SettingsToggle({ checked, onToggle }: SettingsToggleProps) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      tabIndex={0}
      className="flex items-center cursor-pointer"
    >
      <span
        className={`inline-block w-8 h-4 rounded-sm relative transition-colors ${
          checked ? "bg-accent-primary" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-sm bg-white transition-[left] ${
            checked ? "left-[18px]" : "left-[2px]"
          }`}
        />
      </span>
    </span>
  );
}
