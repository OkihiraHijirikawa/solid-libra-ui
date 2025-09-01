// src/components/popover/types.ts
import type { JSX } from "solid-js";
import type { Placement } from "@floating-ui/dom";

export interface PopoverProps {
  children: JSX.Element;
}

export interface PopoverContentProps {
  children: JSX.Element;
  placement?: Placement;
  offset?: number;
}
