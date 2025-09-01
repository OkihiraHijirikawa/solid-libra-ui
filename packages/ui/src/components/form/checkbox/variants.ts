import { cva } from "class-variance-authority";

/** ルート要素 (`div`) のスタイル */
export const rootVariants = cva("relative flex items-center gap-x-2");

/** チェックボックスの視覚的要素 (`span`) のスタイル */
export const checkboxVariants = cva(
  `peer h-4 w-4 shrink-0 rounded-sm border bg-background
   ring-offset-background
   focus-visible:outline-none
   focus-visible:shadow-[0_0_0_1px_var(--brand-color),_0_0_0_3px_rgba(var(--brand-color-rgb),0.2)]
   disabled:cursor-not-allowed disabled:opacity-90 disabled:bg-gray-200`,
  {
    variants: {
      variant: {
        brand:
          "border-gray-500 data-[state=checked]:bg-[var(--brand-color)] data-[state=checked]:border-[var(--brand-color)]",
        primary:
          "border-gray-500 data-[state=checked]:bg-[var(--lb-primary)] data-[state=checked]:border-[var(--lb-primary)]",
        secondary:
          "border-gray-500 data-[state=checked]:bg-[var(--lb-secondary)] data-[state=checked]:border-[var(--lb-secondary)]",
      },
      // エラー状態のバリアント
      isError: {
        true: "border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
      },
    },
    defaultVariants: {
      //
      variant: "primary",
    },
  }
);

/** チェックマークアイコンのスタイル */
export const indicatorVariants = cva("h-4 w-4 text-white");

/** ラベル (`label`) のスタイル */
export const labelVariants = cva(
  "text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
);
