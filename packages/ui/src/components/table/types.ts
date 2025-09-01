// src/components/table/types.ts
import type { JSX } from "solid-js";

// 列の定義
export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: JSX.Element;
  cell: (row: T) => JSX.Element;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  width?: string | number;
}

// ソート設定の型
export type SortConfigItem<T> = {
  key: keyof T;
  direction: "asc" | "desc";
};

// テーブルコンポーネントのProps
export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  class?: string;
  headerVariant?: "default" | "brand";
  striped?: boolean;
  showRowBorder?: boolean;
  layout?: "fit" | "overflow";
  filterPlaceholder?: string;
  enableFiltering?: boolean;
  enableColumnPinning?: boolean;
  rowHeight?: number;
  activeRow?: T | null;
  /** 行を一意に識別するためのキー */
  rowKey?: keyof T;
  onRowClick?: (row: T) => void;
  /** ヘッダーがマウスダウンされたときのコールバック */
  onHeaderMouseDown?: (event: MouseEvent) => void;
}
