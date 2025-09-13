// src/components/button/index.tsx
import { createMemo, Show } from "solid-js";
import { type JSX } from "solid-js";
import { mergeProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useRipple } from "../use-ripple";
import { ButtonProps } from "./types";
import { buttonVariants } from "./variants";

const Button = (props: ButtonProps) => {
  // cvaのデフォルトとpropsをマージ
  const mergedProps = mergeProps(
    { loading: false, iconPosition: "left" },
    props
  );
  const { createRipple } = useRipple();

  const isDisabled = createMemo(
    () => mergedProps.loading || mergedProps.disabled
  );

  /**
   * クリックハンドラ
   * @param e
   */
  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    // リップルエフェクト
    createRipple(e);
    if (typeof mergedProps.onClick === "function") {
      mergedProps.onClick(e);
    }
  };

  return (
    <button
      {...mergedProps}
      class={twMerge(
        buttonVariants({
          variant: mergedProps.variant,
          size: mergedProps.size,
        }),
        mergedProps.class
      )}
      disabled={isDisabled()}
      onClick={handleClick}
    >
      <Show
        when={mergedProps.loading}
        fallback={
          <>
            <Show
              when={mergedProps.iconPosition === "left" && mergedProps.icon}
            >
              <span class="mr-2">{mergedProps.icon}</span>
            </Show>

            {mergedProps.children}

            <Show
              when={mergedProps.iconPosition === "right" && mergedProps.icon}
            >
              <span class="ml-2">{mergedProps.icon}</span>
            </Show>
          </>
        }
      >
        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-3 border-current border-t-transparent rounded-full animate-spin" />
      </Show>
    </button>
  );
};

export default Button;
