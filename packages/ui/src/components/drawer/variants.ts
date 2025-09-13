import { cva } from "class-variance-authority";

/** オーバーレイ */
export const overlayVariants = cva("fixed inset-0 z-50 bg-black/60", {
  variants: {
    state: {
      open: "animate-overlay-in",
      closed: "animate-overlay-out",
    },
  },
});

/** Drawerのコンテンツ本体 */
export const contentVariants = cva("fixed z-50 gap-4 bg-white p-6 shadow-lg", {
  variants: {
    side: {
      top: "inset-x-0 top-0",
      bottom: "inset-x-0 bottom-0",
      left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm",
    },
    state: {
      open: "", // state単体ではクラスを適用しない
      closed: "",
    },
  },
  // `side` と `state` の組み合わせで適用するアニメーションクラスを定義
  compoundVariants: [
    { side: "right", state: "open", class: "animate-drawer-in-right" },
    { side: "right", state: "closed", class: "animate-drawer-out-right" },
    { side: "left", state: "open", class: "animate-drawer-in-left" },
    { side: "left", state: "closed", class: "animate-drawer-out-left" },
    { side: "top", state: "open", class: "animate-drawer-in-top" },
    { side: "top", state: "closed", class: "animate-drawer-out-top" },
    { side: "bottom", state: "open", class: "animate-drawer-in-bottom" },
    { side: "bottom", state: "closed", class: "animate-drawer-out-bottom" },
  ],
  defaultVariants: {
    side: "right",
  },
});

// --- ヘッダー、フッターなどは変更なし ---
export const headerVariants = cva(
  "flex flex-col space-y-2 text-center sm:text-left"
);
export const footerVariants = cva(
  "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
);
export const titleVariants = cva("text-lg font-semibold text-foreground");
export const descriptionVariants = cva("text-sm text-gray-500");
