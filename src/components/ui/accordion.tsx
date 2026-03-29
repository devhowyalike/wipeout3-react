import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

/** Radix accordion root; same props as `@radix-ui/react-accordion` Root. */
const Accordion = AccordionPrimitive.Root;

/** Single collapsible section; forwards ref and props to Radix Item. */
const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={className} {...props} />
));
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps =
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    action?: React.ReactNode;
  };

/** Header row: trigger plus optional `action` node (e.g. a toggle) aligned to the right. */
const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, action, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex items-center">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={[
        "flex flex-1 items-center py-2 transition-all cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
    {action && <div className="shrink-0 flex items-center ml-2">{action}</div>}
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/** Animated expand/collapse region with padded inner wrapper for body content. */
const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={["pb-2 pt-0", className].filter(Boolean).join(" ")}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
