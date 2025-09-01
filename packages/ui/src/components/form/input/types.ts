// src/components/form/input/types.ts
import type { JSX } from "solid-js";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  /** 表示するアイコン要素 */
  icon?: JSX.Element;
  /** アイコンの表示位置 */
  iconPosition?: "left" | "right";
  /** エラー状態かどうか */
  isError?: boolean;
  /** エラー時に表示するメッセージ */
  errorMessage?: string;
  /** アイコンがクリックされたときのイベントハンドラ */
  onIconClick?: (e: MouseEvent) => void;
  /** コンポーネントに適用する追加のクラス */
  class?: string;
}
