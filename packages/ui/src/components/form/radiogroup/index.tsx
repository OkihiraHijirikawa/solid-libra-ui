import {
  createContext,
  createMemo,
  useContext,
  mergeProps,
  Show,
  type JSX,
  type Accessor,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import {
  rootVariants,
  itemVariants,
  radioVariants,
  indicatorVariants,
  labelVariants,
} from "./variants";
import type { RadioGroupProps, RadioGroupItemProps } from "./types";

// --- Context Definition ---
interface RadioGroupContextValue {
  name: Accessor<string | undefined>;
  selectedValue: Accessor<string | undefined>;
  onChange: (value: string) => void;
  variant: Accessor<"brand" | "primary" | "secondary">;
  isError: Accessor<boolean>;
}

const RadioGroupContext = createContext<RadioGroupContextValue>();

// Contextを使いやすくするためのカスタムフック
const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("useRadioGroupContext must be used within a RadioGroup");
  }
  return context;
};

// --- RadioGroup Component ---
export const RadioGroup = (props: RadioGroupProps) => {
  const merged = mergeProps(
    { variant: "primary", isError: false, orientation: "vertical" },
    props
  );

  const contextValue: RadioGroupContextValue = {
    name: () => merged.name,
    selectedValue: () => merged.value,
    onChange: (value) => merged.onChange?.(value),
    variant: () => merged.variant as "brand" | "primary" | "secondary",
    isError: () => merged.isError,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        role="radiogroup"
        class={twMerge(
          // rootVariantsに関数の引数としてorientationを渡す
          rootVariants({
            orientation: merged.orientation as
              | "vertical"
              | "horizontal"
              | null
              | undefined,
          }),
          merged.class
        )}
      >
        {merged.children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// --- RadioGroupItem Component ---
export const RadioGroupItem = (props: RadioGroupItemProps) => {
  const context = useRadioGroupContext();
  const id = createMemo(() => props.id || `radiogroup-item-${props.value}`);
  const isChecked = createMemo(() => context.selectedValue() === props.value);

  const handleOnChange = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    if (target.checked) {
      context.onChange(props.value);
    }
  };

  return (
    <div class={twMerge(itemVariants(), props.class)}>
      <input
        type="radio"
        {...props}
        id={id()}
        class="sr-only peer"
        name={context.name()}
        value={props.value}
        checked={isChecked()}
        onChange={handleOnChange}
      />
      <span
        data-state={isChecked() ? "checked" : "unchecked"}
        class={twMerge(
          radioVariants({
            variant: context.variant(),
            isError: context.isError(),
          })
        )}
        aria-hidden="true"
      >
        <Show when={isChecked()}>
          <div
            class={twMerge(
              indicatorVariants({
                variant: context.variant(),
                isError: context.isError(),
              })
            )}
          />
        </Show>
      </span>
      <label for={id()} class={twMerge(labelVariants())}>
        {props.label}
      </label>
    </div>
  );
};
