// src/components/form/number-input/index.tsx
import { mergeProps, Show, type Component } from "solid-js";
import { twMerge } from "tailwind-merge";
import { numberInputVariants, iconVariants } from "./variants";
import { useNumberInput } from "./use-number-input";
import type { NumberInputProps } from "./types";

const NumberInput: Component<NumberInputProps> = (props) => {
  const mergedProps = mergeProps(
    { iconPosition: "left", decimalPlaces: 0 },
    props
  );

  // カスタムフックから状態とハンドラを取得
  const { displayValue, handleFocus, handleBlur, handleInput } =
    useNumberInput(mergedProps);

  const IconWrapper = () => (
    <span class={twMerge(iconVariants({ position: mergedProps.iconPosition }))}>
      {mergedProps.icon}
    </span>
  );

  return (
    <div>
      <div class="relative flex items-center">
        <Show when={mergedProps.icon && mergedProps.iconPosition === "left"}>
          <IconWrapper />
        </Show>
        <input
          {...mergedProps}
          type="text"
          inputMode="decimal" // より適切なinputmode
          value={displayValue()} // フックから取得した表示用の値
          class={twMerge(
            numberInputVariants({
              isError: mergedProps.isError,
              icon: mergedProps.icon ? mergedProps.iconPosition : "none",
            }),
            mergedProps.class
          )}
          // フックから取得したハンドラ
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
        />
        <Show when={mergedProps.icon && mergedProps.iconPosition === "right"}>
          <IconWrapper />
        </Show>
      </div>
      <Show when={mergedProps.isError && mergedProps.errorMessage}>
        <span class="text-sm text-red-500 mt-1">
          {mergedProps.errorMessage}
        </span>
      </Show>
    </div>
  );
};

export default NumberInput;
