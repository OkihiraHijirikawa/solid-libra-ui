import type { JSX } from "solid-js";

// 各コンポーネントは、class と children を受け取り、
// さらに対応するHTML要素の属性をすべて受け継ぎます。

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps
  extends JSX.HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
  extends JSX.HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {}
