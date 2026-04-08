import { ChevronDown } from "lucide-react";
import {
  type AppOptions,
  type OptionKey,
  OPTION_LABELS,
  OPTION_DESCRIPTIONS,
} from "@/config/options";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SettingsToggle } from "./SettingsToggle";

interface OptionsAccordionProps {
  draft: AppOptions;
  openItems: string[];
  onOpenItemsChange: (items: string[]) => void;
  onToggle: (key: OptionKey) => void;
  optionKeys: OptionKey[];
}

/**
 * Multi-open accordion listing app option toggles with labels and descriptions from config.
 */
export function OptionsAccordion({
  draft,
  openItems,
  onOpenItemsChange,
  onToggle,
  optionKeys,
}: OptionsAccordionProps) {
  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={onOpenItemsChange}
    >
      {optionKeys.map((key) => (
        <AccordionItem
          key={key}
          value={key}
          className={key === "lowResolution" ? "hidden md:block" : undefined}
        >
          <AccordionTrigger
            className={`transition-opacity ${!draft[key] ? "opacity-40" : ""}`}
            action={
              <SettingsToggle
                checked={draft[key]}
                onToggle={() => onToggle(key)}
              />
            }
          >
            <span className="flex flex-1 max-w-[340px] items-center gap-2 text-left uppercase text-xs font-extrabold tracking-wide text-white">
              <ChevronDown
                className={`h-3 w-3 shrink-0 text-white/40 transition-transform duration-200 ${
                  openItems.includes(key) ? "rotate-180" : ""
                }`}
              />
              <span>{OPTION_LABELS[key]}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p className="max-w-[340px] pr-16 sm:pr-0 pl-5 text-xs uppercase font-bold text-body text-pretty">
              {OPTION_DESCRIPTIONS[key]}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
