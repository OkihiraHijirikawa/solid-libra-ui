// src/components/forms/selector/types.ts
import type { JSX } from "solid-js";

// Tは選択される値の型 (string | numberなど)
export interface SelectorProps<T> {
  items: T[]; // オプションの元となるデータ配列
  value: T | null; // 選択されている値
  onValueChange: (selected: T | null) => void; // 値が変更されたときのコールバック
  displayValue: (item: T) => string; // アイテムを表示用に変換する関数
  placeholder?: string;
  class?: string; // Triggerに渡すクラス
  contentClass?: string; // Contentに渡すクラス
}

// Optionコンポーネントは内部で生成するため、Propsは不要
