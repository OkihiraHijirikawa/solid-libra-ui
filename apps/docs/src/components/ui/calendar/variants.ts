// src/components/calendar/variants.ts
import { cva } from "class-variance-authority";

export const dayButtonVariants = cva(
  `w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors`,
  {
    variants: {
      variant: {
        normal: "hover:bg-blue-100",
        today: "border-2 border-blue-500",
        selected:
          "bg-[var(--brand-color)] text-[var(--brand-color-text)] hover:bg-[var(--brand-color)]",
        empty: "bg-transparent cursor-default",
      },
      dayOfWeek: {
        sunday: "text-[var(--sunday-color)]",
        saturday: "text-[var(--saturday-color)]",
        weekday: "",
      },
      isDisabled: {
        true: "text-gray-400 cursor-not-allowed hover:bg-transparent",
      },
    },
    // 複数のvariantが適用された場合のルール
    compoundVariants: [
      // 選択されている日は曜日の色を上書きする
      {
        variant: "selected",
        dayOfWeek: ["saturday", "sunday"],
        class: "text-[var(--brand-color-text)]",
      },
    ],
    defaultVariants: {
      variant: "normal",
      dayOfWeek: "weekday",
    },
  }
);
