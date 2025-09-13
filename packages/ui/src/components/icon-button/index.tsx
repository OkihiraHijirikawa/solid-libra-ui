import { createMemo, type JSX } from "solid-js";
import { mergeProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { iconButtonVariants } from "./variants";
import { useRipple } from "../use-ripple";
import type { IconButtonProps } from "./types";

const IconButton = (props: IconButtonProps) => {
  const mergedProps = mergeProps(props);

  const { createRipple } = useRipple();

  const isDisabled = createMemo(() => mergedProps.disabled);

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    createRipple(e);
    if (typeof mergedProps.onClick === "function") {
      mergedProps.onClick(e);
    }
  };

  return (
    <button
      {...mergedProps}
      class={twMerge(
        iconButtonVariants({
          variant: mergedProps.variant,
          size: mergedProps.size,
        }),
        mergedProps.class
      )}
      disabled={isDisabled()}
      onClick={handleClick}
    >
      {mergedProps.children}
    </button>
  );
};

export default IconButton;
