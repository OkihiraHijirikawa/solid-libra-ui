// src/components/form/textarea/types.ts
import type { ComponentProps } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { textareaVariants } from "./variants";

export interface TextareaProps
  extends ComponentProps<"textarea">, // <textarea>の属性を継承
    VariantProps<typeof textareaVariants> {
  // cvaからisErrorの型を注入
  /** エラー時に表示するメッセージ */
  errorMessage?: string;
}
