// src/components/calendar/use-calendar.ts
import { createSignal, createMemo } from "solid-js";
import { formatDateToYMD } from "../form/date-picker/date-util";
import type { CalendarProps } from "./types";

type DayCell = {
  day: number;
  date: Date | null;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isHoliday: boolean;
  dayOfWeek: number;
};

export const useCalendar = (props: CalendarProps) => {
  const [currentDate, setCurrentDate] = createSignal(
    props.selectedDate || new Date()
  );

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // ヘッダーに表示する年月
  const currentMonthName = createMemo(() =>
    currentDate().toLocaleString(props.locale, {
      month: "long",
      year: "numeric",
    })
  );

  // 曜日名の配列
  const weekdayNames = createMemo(() => {
    const formatter = new Intl.DateTimeFormat(props.locale, {
      weekday: "short",
    });
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2023, 0, i + 1); // 2023/1/1は日曜日
      return formatter.format(date);
    });
    return days;
  });

  // 日付グリッドの生成
  const daysGrid = createMemo((): DayCell[] => {
    const year = currentDate().getFullYear();
    const month = currentDate().getMonth();
    const totalDays = getDaysInMonth(currentDate());
    const firstDay = getFirstDayOfMonth(currentDate());

    const todayYMD = formatDateToYMD(new Date());
    const selectedYMD = props.selectedDate
      ? formatDateToYMD(props.selectedDate)
      : null;
    const minYMD = props.minDate ? formatDateToYMD(props.minDate) : null;
    const maxYMD = props.maxDate ? formatDateToYMD(props.maxDate) : null;
    const holidaysYMD = new Set(props.holidays?.map(formatDateToYMD));

    const grid = Array.from({ length: 42 }, (_, index) => {
      const day = index - firstDay + 1;
      if (day <= 0 || day > totalDays) {
        // 月外の日にも同じ形のオブジェクトを返す
        return {
          day: 0,
          date: null,
          isToday: false,
          isSelected: false,
          isDisabled: true,
          isHoliday: false,
          dayOfWeek: -1, // 曜日なし
        };
      }

      const date = new Date(year, month, day);
      const dateYMD = formatDateToYMD(date);
      const dayOfWeek = date.getDay();

      const isDisabled =
        (minYMD && dateYMD < minYMD) || (maxYMD && dateYMD > maxYMD);

      return {
        day,
        date,
        isToday: dateYMD === todayYMD,
        isSelected: dateYMD === selectedYMD,
        isDisabled,
        isHoliday: holidaysYMD.has(dateYMD),
        dayOfWeek,
      };
    });

    return grid;
  });

  const handlePrevMonth = () =>
    setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    props.onDateSelect(today);
  };

  const handleDateClick = (day: DayCell) => {
    if (day.day === 0 || day.isDisabled || !day.date) return;
    props.onDateSelect(day.date);
  };

  return {
    currentDate,
    currentMonthName,
    weekdayNames,
    daysGrid,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleDateClick,
  };
};
