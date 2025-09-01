// src/components/form/input/index.tsx
import { createMemo, mergeProps, Show, type JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { inputVariants, iconVariants } from "./variants";
import type { InputProps } from "./types";

const Input = (props: InputProps) => {
  const mergedProps = mergeProps({ type: "text", iconPosition: "left" }, props);

  // アイコンがクリック可能かどうかをメモ化
  const isIconInteractive = createMemo(() => !!mergedProps.onIconClick);

  // フォーカス時にテキストを全選択するハンドラ
  const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    e.currentTarget.select();

    if (typeof mergedProps.onFocus === "function") {
      (mergedProps.onFocus as JSX.EventHandler<HTMLInputElement, FocusEvent>)(
        e
      );
    }
  };

  // アイコンを表示するためのラッパーコンポーネント
  const IconWrapper = () => (
    <span
      class={twMerge(
        iconVariants({
          position: mergedProps.iconPosition,
          interactive: isIconInteractive(),
        })
      )}
      onClick={mergedProps.onIconClick}
    >
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
          class={twMerge(
            inputVariants({
              isError: mergedProps.isError,
              // iconプロパティの有無で "left" | "right" | "none" を決定
              icon: mergedProps.icon ? mergedProps.iconPosition : "none",
            }),
            // ユーザーが指定したclassは最後にマージする
            mergedProps.class
          )}
          onFocus={handleFocus}
        />
        <Show when={mergedProps.icon && mergedProps.iconPosition === "right"}>
          <IconWrapper />
        </Show>
      </div>
      <Show when={mergedProps.isError && mergedProps.errorMessage}>
        <p class="text-sm text-red-500 mt-1">{mergedProps.errorMessage}</p>
      </Show>
    </div>
  );
};

export default Input;
