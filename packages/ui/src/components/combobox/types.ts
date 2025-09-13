// src/components/forms/combobox/types.ts
import type { ColumnDef } from "../table/types"; // Tableの型をインポート

export interface ComboBoxProps<T extends {}> {
  /** テーブルに表示するすべてのアイテム */
  items: T[];
  /** Tableに渡す列定義 */
  columns: ColumnDef<T>[];
  /** 選択されているアイテム */
  value: T | null;
  /** 行を一意に識別するためのキー (オプション) */
  rowKey?: keyof T;
  /** アイテムが選択されたときのコールバック */
  onValueChange: (selected: T | null) => void;
  /** 選択されたアイテムを入力欄にどう表示するかを定義する関数 */
  displayValue: (item: T) => string;
  /** プレースホルダー */
  placeholder?: string;
  /** フィルタリングロジックを上書きする関数 (オプション) */
  filterFn?: (item: T, inputText: string) => boolean;
  /** ポップオーバーで表示されるTableコンポーネントに渡すクラス (オプション) */
  contentClass?: string;
}
