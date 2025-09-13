// src/components/forms/number-input/variants.ts
import { cva } from "class-variance-authority";

export const numberInputVariants = cva(
  `flex h-10 w-full rounded-sm border border-gray-500 bg-background 
   text-md ring-offset-background file:border-0 file:bg-transparent 
   file:text-sm file:font-medium placeholder:text-muted-foreground 
   focus-visible:outline-none 
   focus-visible:shadow-[0_0_0_1px_var(--brand-color),_0_0_0_3px_rgba(var(--brand-color-rgb),0.2)]
   disabled:cursor-not-allowed disabled:opacity-90 disabled:bg-gray-200`,
  {
    variants: {
      isError: {
        true: "border-red-500",
      },
      icon: {
        none: "px-3",
        left: "pl-9 pr-3",
        right: "pl-3 pr-9",
      },
    },
    defaultVariants: {
      icon: "none",
    },
  }
);

export const iconVariants = cva(
  "absolute top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4",
  {
    variants: {
      position: {
        left: "left-3",
        right: "right-3",
      },
    },
  }
);
