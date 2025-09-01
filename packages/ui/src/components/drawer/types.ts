import type { JSX, Accessor, Setter } from "solid-js";

export interface DrawerProps {
  // `open`と`onOpenChange`をオプショナルにし、内部状態管理も可能にする
  open?: Accessor<boolean>;
  onOpenChange?: Setter<boolean>;
  side?: "left" | "right" | "top" | "bottom";
  children: JSX.Element;
}

// button要素の属性を継承
export interface DrawerTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface DrawerContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}

export interface DrawerHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export interface DrawerFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {}

// h2要素の属性を継承
export interface DrawerTitleProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {}

// p要素の属性を継承
export interface DrawerDescriptionProps
  extends JSX.HTMLAttributes<HTMLParagraphElement> {}

// button要素の属性を継承
export interface DrawerCloseProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}
