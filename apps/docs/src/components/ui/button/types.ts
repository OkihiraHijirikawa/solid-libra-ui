// src/components/buttons/button/types.ts
import { ParentProps, JSX } from "solid-js";
import { buttonVariants } from "./variants";
import { VariantProps } from "class-variance-authority";

export interface ButtonProps
  extends ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>,
    VariantProps<typeof buttonVariants> {
  class?: string;
  loading?: boolean;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
}
