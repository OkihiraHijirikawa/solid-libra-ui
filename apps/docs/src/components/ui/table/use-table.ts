// src/components/table/use-table.ts
import { createSignal, createMemo, onMount, type JSX } from "solid-js";
import type { TableProps, SortConfigItem } from "./types";

export const useTable = <T extends {}>(props: TableProps<T>) => {
  // --- 状態 (Signals) ---
  const [pinnedColumnKeys, setPinnedColumnKeys] = createSignal<Array<keyof T>>(
    []
  );
  const [filterText, setFilterText] = createSignal("");
  const [sortConfig, setSortConfig] = createSignal<SortConfigItem<T>[]>([]);
  const [scrollTop, setScrollTop] = createSignal(0);
  const [containerHeight, setContainerHeight] = createSignal(0);
  let containerRef: HTMLDivElement | undefined;

  // --- 派生状態 (Memos) ---

  // フィルタリングされたデータ
  const filteredData = createMemo(() => {
    const filter = filterText().toLowerCase();
    if (!filter) return props.data;

    // フィルタ対象の列を絞り込む
    // undefind, falseの場合は対象外とする
    const filterableColumns = props.columns.filter(
      (col) => col.enableFiltering === true
    );

    return props.data.filter((row) => {
      return filterableColumns.some((column) => {
        const value = row[column.accessorKey];
        return String(value).toLowerCase().includes(filter);
      });
    });
  });

  // ソートされたデータ
  const sortedData = createMemo(() => {
    const config = sortConfig();
    const data = filteredData();
    if (config.length === 0) return data;
    return [...data].sort((a, b) => {
      for (const sortItem of config) {
        const aValue = a[sortItem.key];
        const bValue = b[sortItem.key];
        if (aValue < bValue) return sortItem.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortItem.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  });

  // 仮想スクロール用のデータ
  const virtualizer = createMemo(() => {
    const data = sortedData();
    const totalItems = data.length;
    const buffer = 15; // レンダリングする範囲の前後のバッファ
    const rowHeight = props.rowHeight!;

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop() / rowHeight) - buffer
    );
    const endIndex = Math.min(
      totalItems,
      Math.ceil((scrollTop() + containerHeight()) / rowHeight) + buffer
    );

    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push({ index: i, data: data[i] });
    }

    return {
      items,
      paddingTop: startIndex * rowHeight,
      paddingBottom: (totalItems - endIndex) * rowHeight,
    };
  });

  // 列固定の処理を加えた列データ
  const processedColumns = createMemo(() => {
    const pinnedKeys = new Set(pinnedColumnKeys());
    const pinnedColumns = props.columns.filter((c) =>
      pinnedKeys.has(c.accessorKey)
    );
    const unpinnedColumns = props.columns.filter(
      (c) => !pinnedKeys.has(c.accessorKey)
    );
    const orderedColumns = [...pinnedColumns, ...unpinnedColumns];

    let leftOffset = 0;
    return orderedColumns.map((column) => {
      const isPinned = pinnedKeys.has(column.accessorKey);
      const isLastPinned =
        isPinned &&
        pinnedColumns[pinnedColumns.length - 1]?.accessorKey ===
          column.accessorKey;

      if (!isPinned) {
        return { ...column, isPinned, isLastPinned, style: {} };
      }

      const style: JSX.CSSProperties = {
        position: "sticky",
        left: `${leftOffset}px`,
        "z-index": 1,
      };

      if (column.width) {
        const widthValue =
          typeof column.width === "string"
            ? parseInt(column.width, 10)
            : column.width;
        leftOffset += widthValue;
      } else {
        console.warn(
          `Table: Pinned column ('${String(
            column.accessorKey
          )}') should have a 'width' property for correct layout.`
        );
      }

      return { ...column, isPinned, isLastPinned, style };
    });
  });

  // --- イベントハンドラ & 副作用 ---

  const handleSort = (key: keyof T, event: MouseEvent) => {
    const isShiftPressed = event.shiftKey;
    setSortConfig((prevConfig) => {
      if (!isShiftPressed) {
        const isAlreadySingleSort =
          prevConfig.length === 1 && prevConfig[0].key === key;
        if (isAlreadySingleSort) {
          return prevConfig[0].direction === "asc"
            ? [{ key, direction: "desc" }]
            : [];
        }
        return [{ key, direction: "asc" }];
      } else {
        const newConfig = [...prevConfig];
        const existingSortIndex = newConfig.findIndex(
          (item) => item.key === key
        );
        if (existingSortIndex > -1) {
          if (newConfig[existingSortIndex].direction === "asc") {
            newConfig[existingSortIndex].direction = "desc";
          } else {
            newConfig.splice(existingSortIndex, 1);
          }
        } else {
          newConfig.push({ key, direction: "asc" });
        }
        return newConfig;
      }
    });
  };

  const handlePinColumn = (key: keyof T) => {
    setPinnedColumnKeys((prev) => {
      const newKeys = new Set(prev);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      return Array.from(newKeys);
    });
  };

  const handleScroll = (e: Event) => {
    setScrollTop((e.target as HTMLElement).scrollTop);
  };

  onMount(() => {
    if (!containerRef) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    resizeObserver.observe(containerRef);
    setContainerHeight(containerRef.clientHeight);
    return () => resizeObserver.disconnect();
  });

  const getSortDirectionForKey = (key: keyof T) => {
    return sortConfig().find((item) => item.key === key)?.direction;
  };

  return {
    setContainerRef: (el: HTMLDivElement) => (containerRef = el),
    filterText,
    setFilterText,
    processedColumns,
    virtualizer,
    handleSort,
    handlePinColumn,
    handleScroll,
    getSortDirectionForKey,
  };
};
