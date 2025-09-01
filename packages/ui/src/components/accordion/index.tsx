import {
  createContext,
  createMemo,
  createSignal,
  mergeProps,
  Show,
  useContext,
  type JSX,
  onMount,
  on,
  createEffect,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { FiChevronDown } from "solid-icons/fi";
import {
  itemVariants,
  triggerVariants,
  iconVariants,
  contentVariants,
} from "./variants";
import type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "./types";

// --- Contexts ---
interface AccordionContextValue {
  type: "single" | "multiple";
  selectedValue: () => string | string[];
  toggleValue: (value: string) => void;
}
const AccordionContext = createContext<AccordionContextValue>();
const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("useAccordionContext must be used within an Accordion");
  return context;
};

interface AccordionItemContextValue {
  value: string;
  isExpanded: () => boolean;
}
const AccordionItemContext = createContext<AccordionItemContextValue>();
const useAccordionItemContext = () => {
  const context = useContext(AccordionItemContext);
  if (!context)
    throw new Error(
      "useAccordionItemContext must be used within an AccordionItem"
    );
  return context;
};

// --- Components ---
export const Accordion = (props: AccordionProps) => {
  const merged = mergeProps({ type: "single" as const }, props);
  const [selectedValue, setSelectedValue] = createSignal<string | string[]>(
    merged.defaultValue ?? (merged.type === "multiple" ? [] : "")
  );

  const toggleValue = (itemValue: string) => {
    if (merged.type === "single") {
      setSelectedValue((prev) => (prev === itemValue ? "" : itemValue));
    } else {
      setSelectedValue((prev) => {
        const current = Array.isArray(prev) ? prev : [];
        return current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
      });
    }
  };

  const context = {
    type: merged.type,
    selectedValue,
    toggleValue,
  };

  return (
    <AccordionContext.Provider value={context}>
      <div class={twMerge("w-full", props.class)}>{props.children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem = (props: AccordionItemProps) => {
  const { selectedValue } = useAccordionContext();
  const isExpanded = createMemo(() => {
    const selected = selectedValue();
    return Array.isArray(selected)
      ? selected.includes(props.value)
      : selected === props.value;
  });

  const context = { value: props.value, isExpanded };

  return (
    <AccordionItemContext.Provider value={context}>
      <div
        class={twMerge(itemVariants(), props.class)}
        data-state={isExpanded() ? "open" : "closed"}
      >
        {props.children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger = (props: AccordionTriggerProps) => {
  const { toggleValue } = useAccordionContext();
  const { value, isExpanded } = useAccordionItemContext();

  return (
    <h3>
      <button
        {...props}
        data-state={isExpanded() ? "open" : "closed"}
        class={twMerge(triggerVariants(), props.class)}
        onClick={() => toggleValue(value)}
      >
        {props.children}
        <FiChevronDown class={iconVariants()} />
      </button>
    </h3>
  );
};

export const AccordionContent = (props: AccordionContentProps) => {
  const { isExpanded } = useAccordionItemContext();

  return (
    <div
      data-state={isExpanded() ? "open" : "closed"}
      // stateに応じてアニメーションクラスを適用
      class={twMerge(
        contentVariants({ state: isExpanded() ? "open" : "closed" }),
        props.class
      )}
      // アニメーションが子要素に影響しないようにaria-hidden属性を適用
      aria-hidden={!isExpanded()}
    >
      {/* 
        gridアニメーションを正しく動作させるためのラッパー要素。
        この要素の高さが0になったり、コンテンツの高さになったりします。
      */}
      <div class="overflow-hidden">
        <div class="pb-4 pt-0">{props.children}</div>
      </div>
    </div>
  );
};
