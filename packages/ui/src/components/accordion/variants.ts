import { cva } from "class-variance-authority";

/** AccordionItem: 各項目のラッパー */
export const itemVariants = cva("border-b");

/** AccordionTrigger: 開閉ボタン */
export const triggerVariants = cva(
  `flex w-full flex-1 cursor-pointer items-center justify-between py-4 
   font-medium transition-all [&[data-state=open]>svg]:rotate-180`
);

/** Chevron icon for the trigger */
export const iconVariants = cva(
  "h-4 w-4 shrink-0 transition-transform duration-200"
);

/** AccordionContent: 開閉するコンテンツエリア */
export const contentVariants = cva(
  // ベーススタイルに`grid`を追加
  `grid text-sm overflow-hidden`,
  {
    variants: {
      state: {
        // Libra.cssで定義したクラスを使用
        open: "animate-accordion-down",
        closed: "animate-accordion-up",
      },
    },
  }
);
