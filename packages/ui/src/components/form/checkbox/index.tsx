import { createMemo, mergeProps, Show, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { FiCheck } from "solid-icons/fi";
import {
  rootVariants,
  checkboxVariants,
  indicatorVariants,
  labelVariants,
} from "./variants";
import type { CheckboxProps } from "./types";

const Checkbox = (props: CheckboxProps) => {
  // デフォルト値とpropsをマージ
  const mergedProps = mergeProps({ variant: "primary" }, props);

  // エラーメッセージのIDを生成
  const errorMessageId = createMemo(() =>
    mergedProps.isError && mergedProps.errorMessage
      ? `${mergedProps.id}-error`
      : undefined
  );

  return (
    <div>
      <div class={twMerge(rootVariants(), mergedProps.class)}>
        <input
          type="checkbox"
          {...mergedProps}
          class="sr-only peer"
          aria-describedby={errorMessageId()}
        />
        <span
          data-state={mergedProps.checked ? "checked" : "unchecked"}
          class={twMerge(
            checkboxVariants({
              variant: mergedProps.variant,
              isError: mergedProps.isError,
            })
          )}
          aria-hidden="true"
        >
          <Show when={mergedProps.checked}>
            <FiCheck class={twMerge(indicatorVariants())} />
          </Show>
        </span>
        <Show when={mergedProps.label}>
          <label for={mergedProps.id} class={twMerge(labelVariants())}>
            {mergedProps.label}
          </label>
        </Show>
      </div>
      <Show when={mergedProps.isError && mergedProps.errorMessage}>
        <p id={errorMessageId()} class="text-sm text-red-500 mt-1">
          {mergedProps.errorMessage}
        </p>
      </Show>
    </div>
  );
};

export default Checkbox;
