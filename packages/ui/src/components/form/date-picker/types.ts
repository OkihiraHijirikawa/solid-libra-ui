// src/components/form/date-picker/types.ts
import type { InputProps } from "../input/types"; // 既存のInputの型をインポート

// InputのPropsから、Date Pickerが内部で管理するものを除外
type InputPropsForDatePicker = Omit<
  InputProps,
  "value" | "onInput" | "onBlur" | "onIconClick" | "icon" | "iconPosition"
>;

export interface DatePickerProps extends InputPropsForDatePicker {
  /** ロケール (例: 'ja-JP', 'en-US') */
  locale?: string;
  /** 選択されている日付 */
  value?: Date | null;
  /** 選択可能な最小の日付 */
  minDate?: Date;
  /** 選択可能な最大の日付 */
  maxDate?: Date;
  /** 祝日としてマークする日付の配列 */
  holidays?: Date[];
  /** 日付が変更されたときのコールバック */
  onDateChange?: (date: Date | null) => void;
}
