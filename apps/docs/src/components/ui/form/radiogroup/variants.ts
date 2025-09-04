import { cva } from "class-variance-authority";

/** RadioGroup ルート要素 (`div`) のスタイル */
export const rootVariants = cva("flex gap-4", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

/** RadioGroupItem ルート要素 (`div`) のスタイル */
export const itemVariants = cva("relative flex items-center gap-x-2");

/** ラジオボタンの視覚的要素 (`span`) のスタイル */
export const radioVariants = cva(
  `peer h-4 w-4 shrink-0 rounded-full border bg-background
   ring-offset-background
   focus-visible:outline-none
   focus-visible:shadow-[0_0_0_1px_var(--brand-color),_0_0_0_3px_rgba(var(--brand-color-rgb),0.2)]
   disabled:cursor-not-allowed disabled:opacity-90 disabled:bg-gray-200`,
  {
    variants: {
      variant: {
        brand:
          "border-gray-500 data-[state=checked]:border-[var(--brand-color)]",
        primary:
          "border-gray-500 data-[state=checked]:border-[var(--lb-primary)]",
        secondary:
          "border-gray-500 data-[state=checked]:border-[var(--lb-secondary)]",
      },
      isError: {
        true: "border-red-500 data-[state=checked]:border-red-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

/** 選択状態を示す内側の円 (`div`) のスタイル */
export const indicatorVariants = cva(
  "h-full w-full flex items-center justify-center after:content-[''] after:block after:h-2.5 after:w-2.5 after:rounded-full",
  {
    variants: {
      variant: {
        brand: "after:bg-[var(--brand-color)]",
        primary: "after:bg-[var(--lb-primary)]",
        secondary: "after:bg-[var(--lb-secondary)]",
      },
      isError: {
        true: "after:bg-red-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

/** ラベル (`label`) のスタイル */
export const labelVariants = cva(
  "text-sm font-medium leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
