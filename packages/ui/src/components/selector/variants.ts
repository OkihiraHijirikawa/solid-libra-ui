// src/components/forms/selector/variants.ts
import { cva } from "class-variance-authority";

export const selectorTriggerVariants = cva(
  `inline-flex h-10 w-full items-center justify-between whitespace-nowrap rounded-sm 
   border border-gray-500 bg-background px-3 py-2 text-md ring-offset-background 
   placeholder:text-muted-foreground focus:outline-none 
   focus:shadow-[0_0_0_1px_var(--brand-color),_0_0_0_3px_rgba(var(--brand-color-rgb),0.2)] 
   disabled:cursor-not-allowed disabled:opacity-50`
);

export const selectorContentVariants = cva(
  `z-50 overflow-hidden rounded-sm border 
   bg-background p-1 text-popover-foreground shadow-md`
);

export const selectorOptionVariants = cva(
  `relative flex w-full cursor-pointer select-none items-center 
   rounded-sm py-1.5 px-2 text-md outline-none 
   hover:bg-gray-100`, // ホバー時のスタイルを追加
  {
    variants: {
      // アクティブ（キーボードで選択中）な項目のスタイル
      isActive: {
        true: "bg-gray-100",
      },
    },
  }
);
