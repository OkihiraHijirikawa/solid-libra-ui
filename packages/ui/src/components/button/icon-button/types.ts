import { JSX } from "solid-js/jsx-runtime";

export interface IconButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "brand"
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg";
}
