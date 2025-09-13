// src/components/forms/input/variants.ts
import { cva } from "class-variance-authority";

// <input> 要素自体のスタイル定義
export const inputVariants = cva(
  // ベーススタイル
  `flex h-10 w-full rounded-sm border border-gray-500 bg-background 
   text-md ring-offset-background file:border-0 file:bg-transparent 
   file:text-sm file:font-medium placeholder:text-muted-foreground 
   focus-visible:outline-none 
   focus-visible:shadow-[0_0_0_1px_var(--brand-color),_0_0_0_3px_rgba(var(--brand-color-rgb),0.2)]
   disabled:cursor-not-allowed disabled:opacity-90 disabled:bg-gray-200`,
  {
    variants: {
      // エラー状態のバリアント
      isError: {
        true: "border-red-500",
      },
      // アイコンの有無と位置に応じたパディングのバリアント
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

// アイコンを囲む <span> 要素のスタイル定義
export const iconVariants = cva(
  // ベーススタイル
  "absolute top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4",
  {
    variants: {
      // アイコンの位置
      position: {
        left: "left-3",
        right: "right-3",
      },
      // クリック可能かどうかのバリアント
      interactive: {
        true: "cursor-pointer hover:text-[var(--brand-color)]",
      },
    },
  }
);
