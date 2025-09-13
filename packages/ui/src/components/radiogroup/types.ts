import type { JSX } from "solid-js";

/**
 * RadioGroupコンポーネントのProps
 */
export interface RadioGroupProps {
  /** 現在選択されている項目の値 */
  value?: string;
  /**
   * 選択が変更されたときに呼び出されるコールバック関数。
   * 新しく選択された項目の値が引数として渡されます。
   */
  onChange?: (value: string) => void;
  /** 各ラジオボタンに共通で適用される `name` 属性 */
  name?: string;
  /**
   * 見た目の種類。
   * 各 `RadioGroupItem` に継承されます。
   * @default "primary"
   */
  variant?: "brand" | "primary" | "secondary";
  /**
   * ラジオボタンの配置方向。
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
  /**
   * エラー状態かどうか。
   * 各 `RadioGroupItem` に継承されます。
   */
  isError?: boolean;
  /** グループ全体に適用する追加のCSSクラス */
  class?: string;
  /** コンポーネントの子要素 */
  children: JSX.Element;
}

/**
 * RadioGroupItemコンポーネントのProps
 */
export interface RadioGroupItemProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  /** この項目を表すユニークな値（必須） */
  value: string;
  /** この項目に適用する追加のCSSクラス */
  class?: string;
  /** 項目のラベル */
  label: string | JSX.Element;
}
