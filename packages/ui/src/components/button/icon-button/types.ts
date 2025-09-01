import { JSX } from "solid-js/jsx-runtime";

// LbIconButtonコンポーネントのプロパティの型を定義
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
