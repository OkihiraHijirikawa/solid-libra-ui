// src/components/table/styles.ts
import { twMerge } from "tailwind-merge";
import type { TableProps } from "./types";

// ヘッダーのスタイルを決定
export const getHeaderClasses = (variant: TableProps<any>["headerVariant"]) => {
  const base = "h-8 px-2 text-left align-middle font-semibold";
  const variantClass =
    variant === "brand"
      ? "bg-[var(--lb-table-header-bg)] text-[var(--lb-table-header-text)]"
      : "bg-background border-b";
  return twMerge(base, variantClass);
};

// テーブル本体のスタイル
export const getTableClasses = (layout: TableProps<any>["layout"]) => {
  return twMerge(
    "w-full text-md border-separate border-spacing-0",
    layout === "overflow" && "table-fixed"
  );
};

// 行のスタイル
export const getRowClasses = (showBorder: boolean, onRowClick?: any) => {
  return twMerge(
    showBorder && "border-b border-[var(--lb-table-border-row)]",
    !!onRowClick && "cursor-pointer"
  );
};

// セル(td)のスタイル
export const getCellClasses = (
  isStriped: boolean,
  index: number,
  isLastPinned: boolean,
  isActive: boolean
) => {
  const base = "px-2 align-middle transition-colors hover:bg-muted/50";
  const shadowClass = isLastPinned && "shadow-[4px_0_4px_-2px_rgba(0,0,0,0.1)]";

  if (isActive) {
    // アクティブ行のスタイル
    return twMerge(base, shadowClass, "bg-[var(--lb-table-row-bg-active)]");
  }
  const bgClass =
    isStriped && index % 2 === 1
      ? "bg-[var(--lb-table-row-bg-striped)]"
      : "bg-[var(--lb-table-row-bg)]";
  const hoverClass = "hover:bg-muted/50";

  return twMerge(base, bgClass, hoverClass, shadowClass);
};
