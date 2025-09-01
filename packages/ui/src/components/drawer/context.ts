import { createContext, useContext } from "solid-js";
import type { Accessor, Setter } from "solid-js";

interface DrawerContextType {
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  side: Accessor<"left" | "right" | "top" | "bottom">;
  titleId: Accessor<string>;
  descriptionId: Accessor<string>;
}

export const DrawerContext = createContext<DrawerContextType>();

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a Drawer");
  }
  return context;
};
