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
