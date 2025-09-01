// src/components/dialog/index.tsx
import {
  createSignal,
  createEffect,
  onCleanup,
  Show,
  type JSX,
  children,
  createUniqueId,
  on,
} from "solid-js";
import { Portal } from "solid-js/web";
import { twMerge } from "tailwind-merge";
import { DialogContext, useDialogContext } from "./context";
import { dialogOverlayVariants, dialogContentVariants } from "./variants";
import type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogOverlayProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from "./types";

// Dialog: 状態とContextを提供するルートコンポーネント
export const Dialog = (props: DialogProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const titleId = createUniqueId();
  const descriptionId = createUniqueId();

  const context = {
    isOpen,
    setIsOpen,
    titleId: () => titleId,
    descriptionId: () => descriptionId,
  };

  return (
    <DialogContext.Provider value={context}>
      {props.children}
    </DialogContext.Provider>
  );
};

// DialogTrigger: Dialogを開くトリガー
export const DialogTrigger = (props: DialogTriggerProps) => {
  const { setIsOpen } = useDialogContext();
  const resolvedChild = children(() => props.children);

  createEffect(() => {
    const el = resolvedChild() as HTMLElement;
    if (el) {
      el.addEventListener("click", () => setIsOpen(true));
    }
  });

  return <>{resolvedChild()}</>;
};

// DialogClose: Dialogを閉じるトリガー (Content内で使用)
export const DialogClose = (props: DialogCloseProps) => {
  const { setIsOpen } = useDialogContext();
  const resolvedChild = children(() => props.children);

  createEffect(() => {
    const el = resolvedChild() as HTMLElement;
    if (el) {
      el.addEventListener("click", () => setIsOpen(false));
    }
  });

  return <>{resolvedChild()}</>;
};

// DialogOverlay: 背景のオーバーレイ (Transitionでラップされる前提)
const DialogOverlay = (props: DialogOverlayProps) => {
  const { setIsOpen } = useDialogContext();
  return (
    <div
      class={`fixed inset-0 z-40 bg-black/50 ${props.class ?? ""}`}
      onClick={() => setIsOpen(false)}
    />
  );
};

// DialogTitle: Dialogのタイトル (アクセシビリティ対応)
export const DialogTitle = (props: DialogTitleProps) => {
  const { titleId } = useDialogContext();
  return <h2 id={titleId()}>{props.children}</h2>;
};

// DialogDescription: Dialogの説明 (アクセシビリティ対応)
export const DialogDescription = (props: DialogDescriptionProps) => {
  const { descriptionId } = useDialogContext();
  return <p id={descriptionId()}>{props.children}</p>;
};

// DialogContent: 表示されるコンテンツ
export const DialogContent = (props: DialogContentProps) => {
  const { isOpen, setIsOpen, titleId, descriptionId } = useDialogContext();
  const ANIMATION_DURATION = 200;

  // DOMにレンダリングするかどうか
  const [shouldRender, setShouldRender] = createSignal(false);
  // アニメーションの状態を管理（"open" | "closed"）
  const [animationState, setAnimationState] = createSignal<"open" | "closed">(
    "closed"
  );

  let dialogRef: HTMLDivElement | undefined;
  let triggerElement: HTMLElement | null = null;

  // フォーカストラップのロジック
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (e.key !== "Tab" || !dialogRef) return;
    const focusableElements = dialogRef.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  // 開閉状態に応じた副作用とアニメーション制御
  createEffect(
    on(isOpen, (open) => {
      let timeoutId: number;
      if (open) {
        // DOMにマウントする (この時点では animationState は "closed")
        setShouldRender(true);
        triggerElement = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        // アニメーションを開始
        requestAnimationFrame(() => {
          setAnimationState("open");
          dialogRef?.focus(); // アニメーション開始と同時にフォーカス
        });
      } else {
        // アニメーションを開始
        setAnimationState("closed");
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
        triggerElement?.focus();

        // アニメーションが終わったらDOMからアンマウントする
        timeoutId = setTimeout(() => {
          setShouldRender(false);
        }, ANIMATION_DURATION);
      }
      onCleanup(() => clearTimeout(timeoutId));
    })
  );

  return (
    <Show when={shouldRender()}>
      <Portal>
        <div
          class={dialogOverlayVariants({ state: animationState() })}
          onClick={() => setIsOpen(false)}
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId()}
          aria-describedby={descriptionId()}
          tabindex="-1"
          class={twMerge(
            dialogContentVariants({ state: animationState() }),
            props.class
          )}
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  );
};
