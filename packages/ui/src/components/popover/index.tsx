// src/components/popover/index.tsx
import {
  createSignal,
  createEffect,
  onCleanup,
  Show,
  type JSX,
  mergeProps,
  children,
} from "solid-js";
import { Portal } from "solid-js/web";
import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
  Placement,
} from "@floating-ui/dom";
import { PopoverContext, usePopoverContext } from "./context";
import type { PopoverProps, PopoverContentProps } from "./types";

// Popover: 状態とContextを提供するルートコンポーネント
export const Popover = (props: PopoverProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [triggerEl, setTriggerEl] = createSignal<HTMLElement>();
  const [contentEl, setContentEl] = createSignal<HTMLElement>();

  const context = {
    isOpen,
    setIsOpen,
    triggerEl,
    setTriggerEl,
    contentEl,
    setContentEl,
  };

  // クリックで閉じるロジック
  const onClickOutside = (e: MouseEvent) => {
    if (
      !triggerEl()?.contains(e.target as Node) &&
      !contentEl()?.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  // Escapeキーで閉じるロジック
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  };

  createEffect(() => {
    if (isOpen()) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onKeyDown);
    }
    onCleanup(() => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <PopoverContext.Provider value={context}>
      {props.children}
    </PopoverContext.Provider>
  );
};

// PopoverTrigger: Popoverを開閉するトリガー
export const PopoverTrigger = (props: { children: JSX.Element }) => {
  const { setTriggerEl } = usePopoverContext();
  const resolvedChild = children(() => props.children);

  createEffect(() => {
    const el = resolvedChild() as HTMLElement;
    if (el) {
      setTriggerEl(el);
    }
  });

  return <>{resolvedChild()}</>;
};

// PopoverContent: 表示されるコンテンツ
export const PopoverContent = (props: PopoverContentProps) => {
  const { isOpen, triggerEl, contentEl, setContentEl } = usePopoverContext();
  const mergedProps = mergeProps({ placement: "bottom", offset: 8 }, props);

  let cleanup: (() => void) | undefined;

  const updatePosition = () => {
    if (!triggerEl() || !contentEl()) return;
    computePosition(triggerEl()!, contentEl()!, {
      placement: mergedProps.placement as Placement,
      middleware: [offset(mergedProps.offset), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => {
      if (contentEl()) {
        Object.assign(contentEl()!.style, { left: `${x}px`, top: `${y}px` });
      }
    });
  };

  createEffect(() => {
    if (isOpen() && triggerEl() && contentEl()) {
      cleanup = autoUpdate(triggerEl()!, contentEl()!, updatePosition);
    }
    onCleanup(() => cleanup?.());
  });

  return (
    <Show when={isOpen()}>
      <Portal>
        <div ref={setContentEl} class="absolute z-50 top-0 left-0 bg-white">
          {props.children}
        </div>
      </Portal>
    </Show>
  );
};
