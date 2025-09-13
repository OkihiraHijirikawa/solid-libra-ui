// src/components/dialog/context.ts
import { createContext, useContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";

interface DialogContextType {
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  titleId: Accessor<string>;
  descriptionId: Accessor<string>;
}

export const DialogContext = createContext<DialogContextType>();

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a Dialog");
  }
  return context;
};
