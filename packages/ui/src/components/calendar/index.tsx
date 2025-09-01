// src/components/calendar/index.tsx
import { For, Show, mergeProps, type Component } from "solid-js";
import { twMerge } from "tailwind-merge";
import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";
import { useCalendar } from "./use-calendar";
import { dayButtonVariants } from "./variants";
import type { CalendarProps } from "./types";

const Calendar: Component<CalendarProps> = (props) => {
  const mergedProps = mergeProps({ locale: "ja-JP" }, props);
  const {
    currentMonthName,
    weekdayNames,
    daysGrid,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    handleDateClick,
  } = useCalendar(mergedProps);

  const todayButtonText = mergedProps.locale === "ja-JP" ? "今日" : "Today";

  return (
    <div class="w-[300px] pb-4 bg-white rounded-md shadow-lg font-sans">
      {/* Header */}
      <div class="flex justify-between items-center mb-4 p-2 rounded-t-md bg-[var(--brand-color)] text-[var(--brand-color-text)]">
        <button
          onClick={handlePrevMonth}
          class="p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]"
        >
          <FaSolidChevronLeft />
        </button>
        <span class="font-bold text-lg">{currentMonthName()}</span>
        <button
          onClick={handleNextMonth}
          class="p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]"
        >
          <FaSolidChevronRight />
        </button>
      </div>

      {/* Weekdays */}
      <div class="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-gray-500">
        <For each={weekdayNames()}>{(dayName) => <div>{dayName}</div>}</For>
      </div>

      {/* Days Grid */}
      <div class="grid grid-cols-7 gap-1 text-center h-[240px] px-2">
        <For each={daysGrid()}>
          {(day) => (
            <button
              onClick={() => handleDateClick(day)}
              disabled={day.isDisabled}
              class={twMerge(
                dayButtonVariants({
                  variant:
                    day.day === 0
                      ? "empty"
                      : day.isSelected
                      ? "selected"
                      : day.isToday
                      ? "today"
                      : "normal",
                  dayOfWeek:
                    day.dayOfWeek === 0 || day.isHoliday
                      ? "sunday"
                      : day.dayOfWeek === 6
                      ? "saturday"
                      : "weekday",
                  isDisabled: day.isDisabled,
                })
              )}
            >
              <Show when={day.day !== 0}>{day.day}</Show>
            </button>
          )}
        </For>
      </div>

      {/* Today button */}
      <div class="mt-4 text-center">
        <button
          onClick={handleToday}
          class="text-[var(--brand-color)] hover:underline"
        >
          {todayButtonText}
        </button>
      </div>
    </div>
  );
};

export default Calendar;

// // src/components/LbCalendar
// import { createSignal, createMemo, For, Show, mergeProps } from "solid-js";
// import { twMerge } from "tailwind-merge";
// import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";

// interface LbCalendarProps {
//   locale?: string;
//   selectedDate?: Date;
//   onDateSelect: (date: Date) => void;
//   minDate?: Date;
//   maxDate?: Date;
//   holidays?: Date[];
// }

// const LbCalendar = (props: LbCalendarProps) => {
//   const mergedProps = mergeProps({ locale: "ja-JP" }, props);
//   const [currentDate, setCurrentDate] = createSignal(
//     props.selectedDate || new Date()
//   );

//   const getDaysInMonth = (date: Date) => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date: Date) => {
//     // 0 = Sunday, 1 = Monday, ・・・
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   const currentMonthName = createMemo(() =>
//     currentDate().toLocaleString(mergedProps.locale, {
//       month: "long",
//       year: "numeric",
//     })
//   );

//   const daysGrid = createMemo(() => {
//     const totalDays = getDaysInMonth(currentDate());
//     const firstDay = getFirstDayOfMonth(currentDate());
//     const grid: number[] = [];

//     // 前月の空白部分
//     for (let i = 0; i < firstDay; i++) {
//       grid.push(0);
//     }

//     // 今月の日付
//     for (let i = 1; i <= totalDays; i++) {
//       grid.push(i);
//     }

//     while (grid.length < 42) {
//       grid.push(0);
//     }

//     return grid;
//   });

//   const handlePrevMonth = () => {
//     setCurrentDate(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
//     );
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
//     );
//   };

//   const toYMDString = (date: Date) => {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const handleToday = () => {
//     const today = new Date();
//     setCurrentDate(today);
//     mergedProps.onDateSelect(today);
//   };

//   const handleDateClick = (day: number) => {
//     if (day === 0) return;

//     const newDate = new Date(
//       currentDate().getFullYear(),
//       currentDate().getMonth(),
//       day
//     );

//     // 日付の比較を文字列ベースで行う
//     const newDateStr = toYMDString(newDate);
//     const minDateStr = mergedProps.minDate
//       ? toYMDString(mergedProps.minDate)
//       : "";
//     const maxDateStr = mergedProps.maxDate
//       ? toYMDString(mergedProps.maxDate)
//       : "";

//     if (
//       (mergedProps.minDate && newDateStr < minDateStr) ||
//       (mergedProps.maxDate && newDateStr > maxDateStr)
//     ) {
//       return;
//     }

//     mergedProps.onDateSelect(newDate);
//   };

//   const isToday = (day: number) => {
//     const todayStr = toYMDString(new Date());
//     const dateStr = toYMDString(
//       new Date(currentDate().getFullYear(), currentDate().getMonth(), day)
//     );
//     return dateStr === todayStr;
//   };

//   const isSelected = (day: number) => {
//     if (!mergedProps.selectedDate) return false;
//     const selectedDateStr = toYMDString(mergedProps.selectedDate);
//     const dateStr = toYMDString(
//       new Date(currentDate().getFullYear(), currentDate().getMonth(), day)
//     );
//     return dateStr === selectedDateStr;
//   };

//   const isDisabled = (day: number) => {
//     if (day === 0) return true;
//     const date = new Date(
//       currentDate().getFullYear(),
//       currentDate().getMonth(),
//       day
//     );
//     const dateStr = toYMDString(date);
//     const minDateStr = mergedProps.minDate
//       ? toYMDString(mergedProps.minDate)
//       : "";
//     const maxDateStr = mergedProps.maxDate
//       ? toYMDString(mergedProps.maxDate)
//       : "";

//     if (mergedProps.minDate && dateStr < minDateStr) return true;
//     if (mergedProps.maxDate && dateStr > maxDateStr) return true;
//     return false;
//   };

//   // 祝日かどうかを判定する関数
//   const isHoliday = (day: number) => {
//     if (!mergedProps.holidays) return false;
//     const dateStr = toYMDString(
//       new Date(currentDate().getFullYear(), currentDate().getMonth(), day)
//     );
//     return mergedProps.holidays.some(
//       (holiday) => toYMDString(holiday) === dateStr
//     );
//   };

//   const weekdayNames = createMemo(() => {
//     const formatter = new Intl.DateTimeFormat(mergedProps.locale, {
//       weekday: "short",
//     });
//     const date = new Date();
//     // 曜日の開始曜日がロケールによって異なるため、
//     // 日曜日に合わせて曜日の配列を作成する
//     const days = [];
//     for (let i = 0; i < 7; i++) {
//       date.setDate(date.getDate() - date.getDay() + i);
//       days.push(formatter.format(date));
//     }
//     return days;
//   });

//   const todayButtonText = createMemo(() => {
//     if (mergedProps.locale === "ja-JP") {
//       return "今日";
//     }
//     return "Today";
//   });

//   return (
//     <div class="w-[300px] pb-4 bg-white rounded-md shadow-lg font-sans">
//       {/* Header */}
//       <div class="flex justify-between items-center mb-4 p-2 rounded-t-md bg-[var(--brand-color)] text-[var(--brand-color-text)]">
//         <button
//           onClick={handlePrevMonth}
//           class="p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]"
//         >
//           <FaSolidChevronLeft />
//         </button>
//         <span class="font-bold text-lg">{currentMonthName()}</span>
//         <button
//           onClick={handleNextMonth}
//           class="p-1 rounded-full hover:bg-[rgba(255,255,255,0.2)]"
//         >
//           <FaSolidChevronRight />
//         </button>
//       </div>

//       {/* Weekdays */}
//       <div class="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-gray-500">
//         <For each={weekdayNames()}>
//           {(day, index) => (
//             <div
//               class={twMerge(
//                 "w-10",
//                 index() === 0 && "text-[var(--sunday-color)]",
//                 index() === 6 && "text-[var(--saturday-color)]"
//               )}
//             >
//               {day}
//             </div>
//           )}
//         </For>
//       </div>

//       {/* Days Grid */}
//       <div class="grid grid-cols-7 gap-1 text-center h-[280px]">
//         <For each={daysGrid()}>
//           {(day, index) => (
//             <button
//               onClick={() => handleDateClick(day)}
//               disabled={isDisabled(day)}
//               class={twMerge(
//                 `w-10 h-10 flex items-center justify-center rounded-full text-sm
//                 transition-colors`,
//                 day === 0
//                   ? "bg-transparent cursor-default"
//                   : "hover:bg-blue-100",
//                 isToday(day) ? "border-2 border-blue-500" : "",
//                 (index() % 7 === 0 || isHoliday(day)) && !isSelected(day)
//                   ? "text-[var(--sunday-color)]"
//                   : "",
//                 index() % 7 === 6 && "text-[var(--saturday-color)]",
//                 isSelected(day)
//                   ? "bg-[var(--brand-color)] text-[var(--brand-color-text)] hover:bg-[var(--brand-color)]"
//                   : "",
//                 isDisabled(day) ? "text-gray-400 cursor-not-allowed" : ""
//               )}
//             >
//               <Show when={day !== 0}>{day}</Show>
//             </button>
//           )}
//         </For>
//       </div>

//       {/* Today button */}
//       <div class="mt-4 text-center">
//         <button
//           onClick={handleToday}
//           class="text-[var(--brand-color)] hover:underline"
//         >
//           {todayButtonText()}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LbCalendar;
