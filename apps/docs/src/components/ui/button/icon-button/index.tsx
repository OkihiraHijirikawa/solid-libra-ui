import { createMemo, type JSX } from "solid-js";
import { mergeProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { VariantProps } from "class-variance-authority"; // cvaから型をインポート
import { iconButtonVariants } from "./variants";
import { useRipple } from "../use-ripple";
import type { IconButtonProps } from "./types"; // 型定義もcvaに合わせて調整すると更に良い

const LbIconButton = (props: IconButtonProps) => {
  // cvaのdefaultVariantsがあるので、propsのマージはシンプルになる
  const mergedProps = mergeProps(props);

  const { createRipple } = useRipple();

  const isDisabled = createMemo(() => mergedProps.disabled);

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    createRipple(e); // フックを呼び出す
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

export default LbIconButton;
