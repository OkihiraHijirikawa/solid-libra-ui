// src/components/forms/selector/use-selector.ts

import {
  createSignal,
  createEffect,
  on,
  createMemo,
  onCleanup,
} from "solid-js";
import { usePopoverContext } from "../popover/context";
import type { SelectorProps } from "./types";

export const useSelector = <T>(props: SelectorProps<T>) => {
  const { isOpen, setIsOpen, contentEl } = usePopoverContext();
  const [activeValue, setActiveValue] = createSignal<T | null>(null);
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement | undefined>();

  createEffect(() => {
    if (isOpen()) {
      setActiveValue(() => props.value);
    } else {
      setActiveValue(null);
    }
  });

  createEffect(
    on(activeValue, (val) => {
      if (!isOpen() || val === null || !contentEl()) return;
      requestAnimationFrame(() => {
        const activeEl = contentEl()?.querySelector<HTMLDivElement>(
          `[data-value="${String(props.displayValue(val))}"]`
        );
        if (activeEl) {
          activeEl.scrollIntoView({ block: "nearest" });
        }
      });
    })
  );

  createEffect(() => {
    const trigger = triggerEl();
    const content = contentEl();
    if (!trigger || !content) return;

    const observer = new ResizeObserver((entries) => {
      const triggerWidth = entries[0]?.contentRect.width;
      if (triggerWidth) {
        content.style.minWidth = `${triggerWidth}px`;
      }
    });

    observer.observe(trigger);
    onCleanup(() => observer.disconnect());
  });

  const displayValue = createMemo(() => {
    if (props.value) {
      return props.displayValue(props.value);
    }
    return props.placeholder ?? "選択してください...";
  });

  const handleOptionClick = (item: T) => {
    props.onValueChange(item);
    setIsOpen(false);
  };

  // クリックでPopoverの表示/非表示を切り替える
  const handleClick = () => {
    setIsOpen(!isOpen());
  };

  // フォーカスが外れた時にPopoverを閉じる
  const handleBlur = () => {
    setTimeout(() => {
      const content = contentEl();
      if (content && content.contains(document.activeElement)) {
        return;
      }
      setIsOpen(false);
    }, 150);
  };

  // キーボード操作のハンドラ
  const handleKeyDown = (e: KeyboardEvent) => {
    // Popoverが閉じていたら、特定のキーで開く
    if (!isOpen()) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    // Popoverが開いているときの処理
    e.preventDefault();
    const items = props.items;
    const currentIndex = items.findIndex((item) => item === activeValue());

    if (e.key === "ArrowDown") {
      const nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
      setActiveValue(() => items[nextIndex]);
    } else if (e.key === "ArrowUp") {
      const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      setActiveValue(() => items[prevIndex]);
    } else if (e.key === "Enter") {
      if (activeValue() !== null) {
        handleOptionClick(activeValue()!);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // ハンドラを1つのオブジェクトにまとめる
  const triggerProps = {
    ref: setTriggerEl,
    onClick: handleClick,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };

  return {
    displayValue,
    activeValue,
    handleOptionClick,
    triggerProps,
  };
};
