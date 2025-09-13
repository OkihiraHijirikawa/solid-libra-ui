// src/components/dialog/types.ts
import type { JSX } from "solid-js";

export interface DialogProps {
  children: JSX.Element;
}

export interface DialogTriggerProps {
  children: JSX.Element;
}

export interface DialogContentProps {
  children: JSX.Element;
  class?: string;
}

export interface DialogOverlayProps {
  class?: string;
}

export interface DialogTitleProps {
  children: JSX.Element;
}

export interface DialogDescriptionProps {
  children: JSX.Element;
}

export interface DialogCloseProps {
  children: JSX.Element;
}
