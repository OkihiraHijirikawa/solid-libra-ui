import type { JSX } from "solid-js";

export interface CheckboxProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * チェックボックスの隣に表示するラベル。
   * 文字列またはJSX要素を指定できます。
   */
  label?: string | JSX.Element;
  /**
   * チェックボックスの見た目の種類。
   * @default "primary"
   */
  variant?: "brand" | "primary" | "secondary";
  /**
   * エラー状態かどうかを示します。
   * trueにするとボーダーが赤色になります。
   */
  isError?: boolean;
  /**
   * エラー状態のときに表示するメッセージ。
   * isErrorがtrueの場合にのみ表示されます。
   */
  errorMessage?: string;
  /**
   * ルート要素に適用する追加のCSSクラス。
   */
  class?: string;
  /**
   * label要素との紐付けに使用するID。アクセシビリティのために必須です。
   */
  id: string;
}
