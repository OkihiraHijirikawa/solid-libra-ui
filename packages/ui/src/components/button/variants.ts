// src/components/buttons/variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  // ベースとなる共通クラス
  `inline-flex items-center justify-center rounded-sm text-md font-medium 
   transition-colors focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 
   disabled:pointer-events-none ring-offset-background
   cursor-pointer relative overflow-hidden`,
  {
    variants: {
      // variantごとのクラス
      variant: {
        brand:
          "bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color-hover)]",
        primary:
          "bg-[var(--lb-primary)] text-white hover:bg-[var(--lb-primary-hover)]",
        secondary:
          "bg-[var(--lb-secondary)] text-white hover:bg-[var(--lb-secondary-hover)]",
        warning:
          "bg-[var(--lb-warning)] text-white hover:bg-[var(--lb-warning-hover)]",
        danger:
          "bg-[var(--lb-danger)] text-white hover:bg-[var(--lb-danger-hover)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[var(--lb-primary)] underline-offset-4 hover:underline",
      },
      // sizeごとのクラス
      size: {
        sm: "h-8 px-6",
        md: "h-10 px-8",
        lg: "h-12 px-12",
      },
    },
    // デフォルトのvariantとsize
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
