import {
  createSignal,
  createEffect,
  onCleanup,
  Show,
  type JSX,
  on,
  mergeProps,
  createUniqueId,
} from "solid-js";
import { Portal } from "solid-js/web";
import { twMerge } from "tailwind-merge";
import { DrawerContext, useDrawerContext } from "./context";
import {
  overlayVariants,
  contentVariants,
  headerVariants,
  footerVariants,
  titleVariants,
  descriptionVariants,
} from "./variants";
import type {
  DrawerProps,
  DrawerTriggerProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerCloseProps,
} from "./types";

export const Drawer = (props: DrawerProps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const titleId = createUniqueId();
  const descriptionId = createUniqueId();

  const context = {
    isOpen: props.open ?? isOpen,
    setIsOpen: props.onOpenChange ?? setIsOpen,
    side: () => props.side ?? "right",
    titleId: () => titleId,
    descriptionId: () => descriptionId,
  };

  return (
    <DrawerContext.Provider value={context}>
      {props.children}
    </DrawerContext.Provider>
  );
};

export const DrawerTrigger = (props: DrawerTriggerProps) => {
  const { setIsOpen } = useDrawerContext();
  return <button {...props} onClick={() => setIsOpen(true)} />;
};

export const DrawerClose = (props: DrawerCloseProps) => {
  const { setIsOpen } = useDrawerContext();
  return <button {...props} onClick={() => setIsOpen(false)} />;
};

export const DrawerContent = (props: DrawerContentProps) => {
  const { isOpen, setIsOpen, side, titleId, descriptionId } =
    useDrawerContext();
  const ANIMATION_DURATION = 200;

  const [shouldRender, setShouldRender] = createSignal(false);
  const [animationState, setAnimationState] = createSignal<"open" | "closed">(
    "closed"
  );

  let drawerRef: HTMLDivElement | undefined;
  let triggerElement: HTMLElement | null = null;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key !== "Tab" || !drawerRef) return;

    const focusable = drawerRef.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  };

  createEffect(
    on(isOpen, (open) => {
      let timeoutId: number;
      if (open) {
        setShouldRender(true);
        triggerElement = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        requestAnimationFrame(() => {
          setAnimationState("open");
          drawerRef?.focus();
        });
      } else {
        setAnimationState("closed");
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
        triggerElement?.focus();

        timeoutId = setTimeout(
          () => setShouldRender(false),
          ANIMATION_DURATION
        );
      }
      onCleanup(() => clearTimeout(timeoutId));
    })
  );

  return (
    <Show when={shouldRender()}>
      <Portal>
        <div
          class={overlayVariants({ state: animationState() })}
          onClick={() => setIsOpen(false)}
        />
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId()}
          aria-describedby={descriptionId()}
          tabindex="-1"
          class={twMerge(
            contentVariants({ side: side(), state: animationState() }),
            props.class
          )}
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  );
};

export const DrawerHeader = (props: DrawerHeaderProps) => (
  <div {...props} class={twMerge(headerVariants(), props.class)} />
);
export const DrawerFooter = (props: DrawerFooterProps) => (
  <div {...props} class={twMerge(footerVariants(), props.class)} />
);
export const DrawerTitle = (props: DrawerTitleProps) => (
  <h2
    id={useDrawerContext().titleId()}
    {...props}
    class={twMerge(titleVariants(), props.class)}
  />
);
export const DrawerDescription = (props: DrawerDescriptionProps) => (
  <p
    id={useDrawerContext().descriptionId()}
    {...props}
    class={twMerge(descriptionVariants(), props.class)}
  />
);
