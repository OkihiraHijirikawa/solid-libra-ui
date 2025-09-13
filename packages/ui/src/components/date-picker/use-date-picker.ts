// src/components/forms/date-picker/use-date-picker.ts
import { createSignal, createEffect, on } from "solid-js";
import { usePopoverContext } from "../popover/context"; // パスを修正
import type { DatePickerProps } from "./types";

export const useDatePicker = (props: DatePickerProps) => {
  const { isOpen, setIsOpen } = usePopoverContext();

  const [selectedDate, setSelectedDate] = createSignal<Date | null>(
    props.value || null
  );
  const [inputValue, setInputValue] = createSignal("");

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    try {
      return new Intl.DateTimeFormat(props.locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);
    } catch {
      return "";
    }
  };

  // 外部からprops.valueが変更されたら、内部状態を更新
  createEffect(
    on(
      () => props.value,
      (value) => {
        setSelectedDate(value === undefined ? null : value);
      }
    )
  );

  // 内部のselectedDateが変更されたら、Inputの表示文字列を更新
  createEffect(() => {
    setInputValue(formatDate(selectedDate()));
  });

  // Calendarで日付が選択されたときのハンドラ
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    props.onDateChange?.(date);
    setIsOpen(false); // Popoverを閉じる
  };

  // アイコンボタン用クリックハンドラ
  const handleIconClick = () => {
    setIsOpen(!isOpen()); // Popoverの開閉状態をトグルする
  };

  // Inputに手入力されたときのハンドラ
  const handleInput = (e: Event) => {
    setInputValue((e.target as HTMLInputElement).value);
  };

  // Inputからフォーカスが外れたときのハンドラ
  const handleBlur = () => {
    const parsedDate = new Date(inputValue());
    if (
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime()) &&
      inputValue().trim().length >= 8
    ) {
      setSelectedDate(parsedDate);
      props.onDateChange?.(parsedDate);
    } else {
      //setInputValue(formatDate(selectedDate()));
      setSelectedDate(null);
      props.onDateChange?.(null);
    }
    setIsOpen(false);
  };

  return {
    selectedDate,
    inputValue,
    handleDateSelect,
    handleInput,
    handleBlur,
    handleIconClick,
  };
};
