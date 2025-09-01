// src/components/popover/context.ts
import { createContext, useContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";

interface PopoverContextType {
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  triggerEl: Accessor<HTMLElement | undefined>;
  setTriggerEl: Setter<HTMLElement | undefined>;
  contentEl: Accessor<HTMLElement | undefined>;
  setContentEl: Setter<HTMLElement | undefined>;
}

export const PopoverContext = createContext<PopoverContextType>();

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopoverContext must be used within a Popover");
  }
  return context;
};
