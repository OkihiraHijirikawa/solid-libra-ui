// src/components/forms/date-picker/index.tsx
import { type Component, mergeProps } from "solid-js";
import { AiOutlineCalendar } from "solid-icons/ai";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import Calendar from "../calendar";
import Input from "../input";
import { useDatePicker } from "./use-date-picker";
import type { DatePickerProps } from "./types";
import { usePopoverContext } from "../popover/context";

const DatePickerContent: Component<DatePickerProps> = (props) => {
  const { setIsOpen } = usePopoverContext(); // アイコンクリックのためにContextを取得
  const {
    selectedDate,
    inputValue,
    handleDateSelect,
    handleInput,
    handleBlur,
    handleIconClick,
  } = useDatePicker(props);

  return (
    <>
      <PopoverTrigger>
        <Input
          {...props}
          value={inputValue()}
          onInput={handleInput}
          onBlur={handleBlur}
          onIconClick={handleIconClick}
          placeholder={props.placeholder || "YYYY/MM/DD"}
          icon={<AiOutlineCalendar />}
          iconPosition="right"
        />
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          locale={props.locale}
          minDate={props.minDate}
          maxDate={props.maxDate}
          holidays={props.holidays}
          selectedDate={selectedDate() || undefined}
          onDateSelect={handleDateSelect}
        />
      </PopoverContent>
    </>
  );
};

// DatePickerコンポーネントの最終的な形
const DatePicker: Component<DatePickerProps> = (props) => {
  const mergedProps = mergeProps({ locale: "ja-JP" }, props);

  return (
    // Popoverで全体をラップする
    <Popover>
      <DatePickerContent {...mergedProps} />
    </Popover>
  );
};

export default DatePicker;
