import type { JSX } from "solid-js";

// Accordion (ルート)
export interface AccordionProps {
  /**
   * アコーディオンのタイプ。
   * 'single': 一度に一つの項目のみ開けます。
   * 'multiple': 複数の項目を同時に開けます。
   * @default "single"
   */
  type?: "single" | "multiple";
  /**
   * 初期状態で開いている項目の値。
   * 'single'の場合は文字列、'multiple'の場合は文字列の配列。
   */
  defaultValue?: string | string[];
  /** 子要素 */
  children: JSX.Element;
  /** ルート要素に適用する追加のCSSクラス */
  class?: string;
}

// AccordionItem (各項目)
export interface AccordionItemProps {
  /** この項目を識別するためのユニークな値（必須） */
  value: string;
  /** 子要素 */
  children: JSX.Element;
  /** この項目に適用する追加のCSSクラス */
  class?: string;
}

// AccordionTrigger (開閉ボタン)
export interface AccordionTriggerProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

// AccordionContent (開閉されるコンテンツ)
export interface AccordionContentProps
  extends JSX.HTMLAttributes<HTMLDivElement> {}
