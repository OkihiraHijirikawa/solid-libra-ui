// src/components/forms/textarea/variants.ts
import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  // ベースとなる共通クラス
  `flex w-full rounded-sm border border-gray-500 bg-background 
   text-md ring-offset-background placeholder:text-muted-foreground 
   focus-visible:outline-none 
   focus-visible:shadow-[0_0_0_1px_var(--brand-color),_0_0_0_3px_rgba(var(--brand-color-rgb),0.2)]
   disabled:cursor-not-allowed disabled:opacity-90 disabled:bg-gray-200
   p-3 resize-none`,
  {
    variants: {
      // isErrorバリアント
      isError: {
        true: "border-red-500", // エラー時のボーダースタイル
      },
    },
    defaultVariants: {
      isError: false,
    },
  }
);
