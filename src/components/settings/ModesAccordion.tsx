import { ChevronDown } from "lucide-react";
import {
  type AppOptions,
  MODE_DESCRIPTIONS,
  MODAL_BREAKPOINT,
  MODAL_BREAKPOINT_CLASSES,
} from "@/config/options";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SettingsToggle } from "./SettingsToggle";

interface ModesAccordionProps {
  draft: AppOptions;
  openModeItems: string[];
  onOpenModeItemsChange: (items: string[]) => void;
  onPureModeToggle: () => void;
  onReactModeToggle: () => void;
}

function PopupBlockedNotice() {
  if (!MODAL_BREAKPOINT) return null;
  return (
    <span
      className={`${MODAL_BREAKPOINT_CLASSES.hiddenInline} font-normal opacity-80`}
    >
      {" — "}
      Pop-up windows may be blocked by your browser. Enable "Modal Overlays" if
      you experience issues.
    </span>
  );
}

interface ModeAccordionItemProps {
  id: "reactMode" | "pureMode";
  label: string;
  checked: boolean;
  openItems: string[];
  onToggle: () => void;
  notice?: React.ReactNode;
}

function ModeAccordionItem({
  id,
  label,
  checked,
  openItems,
  onToggle,
  notice,
}: ModeAccordionItemProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger
        className={`transition-all text-white ${checked ? "" : "opacity-40"}`}
        action={<SettingsToggle checked={checked} onToggle={onToggle} />}
      >
        <span className="flex flex-1 max-w-[340px] items-center gap-2 text-left uppercase text-xs font-extrabold tracking-wide">
          <ChevronDown
            className={`h-3 w-3 shrink-0 text-white/40 transition-transform duration-200 ${
              openItems.includes(id) ? "rotate-180" : ""
            }`}
          />
          <span>{label}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <p className="max-w-[340px] pr-16 sm:pr-4 pl-5 text-xs uppercase font-bold text-body text-pretty">
          {MODE_DESCRIPTIONS[id]}
          {notice}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

/**
 * Settings accordion for React Mode and Pure Mode toggles plus their description copy.
 */
export function ModesAccordion({
  draft,
  openModeItems,
  onOpenModeItemsChange,
  onPureModeToggle,
  onReactModeToggle,
}: ModesAccordionProps) {
  return (
    <div className="mt-8 pt-4 border-t border-nav/20">
      <Accordion
        type="multiple"
        value={openModeItems}
        onValueChange={onOpenModeItemsChange}
      >
        <ModeAccordionItem
          id="reactMode"
          label="React Mode"
          checked={draft.reactMode}
          openItems={openModeItems}
          onToggle={onReactModeToggle}
        />
        <ModeAccordionItem
          id="pureMode"
          label="Pure Mode"
          checked={draft.pureMode}
          openItems={openModeItems}
          onToggle={onPureModeToggle}
          notice={<PopupBlockedNotice />}
        />
      </Accordion>
    </div>
  );
}
