// src/components/dialog/variants.ts
import { cva } from "class-variance-authority";

export const dialogOverlayVariants = cva(
  // ベーススタイル
  "fixed inset-0 z-40 bg-black/50",
  {
    variants: {
      state: {
        open: "animate-overlay-in",
        closed: "animate-overlay-out",
      },
    },
  }
);

export const dialogContentVariants = cva(
  // ベーススタイル
  `fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg 
   gap-4 rounded-sm bg-white p-6 shadow-lg`,
  {
    variants: {
      state: {
        open: "animate-content-in",
        closed: "animate-content-out",
      },
    },
  }
);
