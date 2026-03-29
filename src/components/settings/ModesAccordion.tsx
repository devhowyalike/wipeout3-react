import { ChevronDown } from "lucide-react";
import { type AppOptions, MODE_DESCRIPTIONS } from "@/config/options";
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

/**
 * Settings accordion for Pure Mode and React Mode toggles plus their description copy.
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
        <AccordionItem value="pureMode">
          <AccordionTrigger
            className={`transition-all text-white ${draft.pureMode ? "" : "opacity-40"}`}
            action={
              <SettingsToggle checked={draft.pureMode} onToggle={onPureModeToggle} />
            }
          >
            <span className="flex flex-1 max-w-[340px] items-center gap-2 text-left uppercase text-xs font-extrabold tracking-wide">
              <ChevronDown
                className={`h-3 w-3 shrink-0 text-white/40 transition-transform duration-200 ${
                  openModeItems.includes("pureMode") ? "rotate-180" : ""
                }`}
              />
              <span>Pure Mode</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="max-w-[340px] pr-16 sm:pr-4 pl-5 text-xs uppercase font-bold text-body">
              {MODE_DESCRIPTIONS.pureMode}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reactMode">
          <AccordionTrigger
            className={`transition-all text-white ${draft.reactMode ? "" : "opacity-40"}`}
            action={
              <SettingsToggle checked={draft.reactMode} onToggle={onReactModeToggle} />
            }
          >
            <span className="flex flex-1 max-w-[340px] items-center gap-2 text-left uppercase text-xs font-extrabold tracking-wide">
              <ChevronDown
                className={`h-3 w-3 shrink-0 text-white/40 transition-transform duration-200 ${
                  openModeItems.includes("reactMode") ? "rotate-180" : ""
                }`}
              />
              <span>React Mode</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="max-w-[340px] pr-16 sm:pr-4 pl-5 text-xs uppercase font-bold text-body">
              {MODE_DESCRIPTIONS.reactMode}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
