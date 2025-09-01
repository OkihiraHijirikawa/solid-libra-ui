import { For } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Popover, PopoverTrigger, PopoverContent } from "../../popover";
import { useSelector } from "./use-selector";
import {
  selectorTriggerVariants,
  selectorContentVariants,
  selectorOptionVariants,
} from "./variants";
import type { SelectorProps } from "./types";

const SelectorImpl = <T,>(props: SelectorProps<T>) => {
  // フックからUIの描画に必要な値と、トリガーボタン用のpropsをまとめて受け取る
  const { displayValue, activeValue, handleOptionClick, triggerProps } =
    useSelector(props);

  return (
    <>
      <PopoverTrigger>
        <button
          {...triggerProps}
          type="button"
          class={twMerge(selectorTriggerVariants(), props.class)}
        >
          {displayValue()}
        </button>
      </PopoverTrigger>
      <PopoverContent placement="bottom-start" offset={4}>
        <div class={twMerge(selectorContentVariants(), props.contentClass)}>
          <For each={props.items}>
            {(item) => (
              <div
                class={twMerge(
                  selectorOptionVariants({ isActive: activeValue() === item })
                )}
                data-value={props.displayValue(item)}
                onClick={() => handleOptionClick(item)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOptionClick(item);
                  }
                }}
              >
                {props.displayValue(item)}
              </div>
            )}
          </For>
        </div>
      </PopoverContent>
    </>
  );
};

const Selector = <T,>(props: SelectorProps<T>) => {
  return (
    <Popover>
      <SelectorImpl {...props} />
    </Popover>
  );
};

export default Selector;
