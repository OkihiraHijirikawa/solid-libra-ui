// src/components/forms/textarea/index.tsx
import { mergeProps, Show, type Component } from "solid-js";
import { twMerge } from "tailwind-merge";
import { textareaVariants } from "./variants";
import type { TextareaProps } from "./types";

const Textarea: Component<TextareaProps> = (props) => {
  // propsにデフォルト値をマージ
  const mergedProps = mergeProps({ rows: 4 }, props);

  return (
    <div>
      <textarea
        {...mergedProps}
        class={twMerge(
          // cvaで生成したクラスと、ユーザーが指定したクラスをマージ
          textareaVariants({ isError: mergedProps.isError }),
          mergedProps.class
        )}
      />
      <Show when={mergedProps.isError && mergedProps.errorMessage}>
        <p class="text-sm text-red-500 mt-1">{mergedProps.errorMessage}</p>
      </Show>
    </div>
  );
};

export default Textarea;
