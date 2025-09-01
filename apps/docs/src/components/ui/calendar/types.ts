// src/components/calendar/types.ts
export interface CalendarProps {
  /** ロケール (例: 'ja-JP', 'en-US') */
  locale?: string;
  /** 選択されている日付 */
  selectedDate?: Date;
  /** 選択可能な最小の日付 */
  minDate?: Date;
  /** 選択可能な最大の日付 */
  maxDate?: Date;
  /** 祝日としてマークする日付の配列 */
  holidays?: Date[];
  /** 日付が選択されたときのコールバック */
  onDateSelect: (date: Date) => void;
}
