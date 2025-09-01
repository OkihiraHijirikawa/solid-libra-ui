// src/components/avatar/variants.ts
import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  // ベースとなる共通クラス
  `relative inline-flex items-center justify-center align-middle 
   overflow-hidden rounded-full select-none font-medium 
   bg-muted text-muted-foreground`,
  {
    variants: {
      // sizeごとのクラス
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-16 w-16 text-lg",
      },
    },
    // デフォルトのsize
    defaultVariants: {
      size: "md",
    },
  }
);
