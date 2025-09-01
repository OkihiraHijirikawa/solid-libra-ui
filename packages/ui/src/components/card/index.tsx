import { twMerge } from "tailwind-merge";

import type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from "./types";

import {
  cardVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardDescriptionVariants,
  cardContentVariants,
  cardFooterVariants,
} from "./variants";

// Card (ルート)
export const Card = (props: CardProps) => (
  <div {...props} class={twMerge(cardVariants(), props.class)} />
);

// CardHeader
export const CardHeader = (props: CardHeaderProps) => (
  <div {...props} class={twMerge(cardHeaderVariants(), props.class)} />
);

// CardTitle (h3要素としてレンダリング)
export const CardTitle = (props: CardTitleProps) => (
  <h3 {...props} class={twMerge(cardTitleVariants(), props.class)} />
);

// CardDescription (p要素としてレンダリング)
export const CardDescription = (props: CardDescriptionProps) => (
  <p {...props} class={twMerge(cardDescriptionVariants(), props.class)} />
);

// CardContent
export const CardContent = (props: CardContentProps) => (
  <div {...props} class={twMerge(cardContentVariants(), props.class)} />
);

// CardFooter
export const CardFooter = (props: CardFooterProps) => (
  <div {...props} class={twMerge(cardFooterVariants(), props.class)} />
);
