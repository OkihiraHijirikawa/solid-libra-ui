// src/components/table/index.tsx
import { For, Show, mergeProps, type Component, createMemo } from "solid-js";
import { twMerge } from "tailwind-merge";
import {
  BiRegularUpArrow,
  BiRegularDownArrow,
  BiSolidPin,
  BiRegularPin,
} from "solid-icons/bi";
import Input from "../input";
import { AiOutlineSearch } from "solid-icons/ai";
import { useTable } from "./use-table";
import {
  getHeaderClasses,
  getTableClasses,
  getRowClasses,
  getCellClasses,
} from "./styles";
import type { TableProps } from "./types";

const Table = <T extends {}>(props: TableProps<T>) => {
  const mergedProps = mergeProps(
    {
      headerVariant: "default" as "default" | "brand" | undefined,
      striped: false,
      showRowBorder: true,
      layout: "fit" as "fit" | "overflow" | undefined,
      rowHeight: 41,
      filterPlaceholder: "テーブル内を検索...",
      enableFiltering: true,
      enableColumnPinning: true,
    },
    props
  );

  const {
    setContainerRef,
    filterText,
    setFilterText,
    processedColumns,
    virtualizer,
    handleSort,
    handlePinColumn,
    handleScroll,
    getSortDirectionForKey,
  } = useTable(mergedProps);

  const ColGroup = () => (
    <colgroup>
      <For each={processedColumns()}>
        {(column) => (
          <col
            style={
              mergedProps.layout === "overflow" && column.width
                ? {
                    width:
                      typeof column.width === "number"
                        ? `${column.width}px`
                        : column.width,
                  }
                : undefined
            }
          />
        )}
      </For>
    </colgroup>
  );

  return (
    <div class={twMerge("flex flex-col h-full", mergedProps.class)}>
      <Show when={mergedProps.enableFiltering}>
        <div class="flex-shrink-0 p-2">
          <Input
            placeholder={mergedProps.filterPlaceholder}
            value={filterText()}
            onInput={(e) => setFilterText(e.currentTarget.value)}
            icon={<AiOutlineSearch size={20} />}
            iconPosition="left"
            class="max-w-xs"
          />
        </div>
      </Show>

      <div
        ref={setContainerRef}
        onScroll={handleScroll}
        class="flex-1 rounded-md border border-[var(--lb-table-border-outer)] overflow-auto"
        style={{ "scroll-padding-top": "32px" }}
      >
        <table
          class={getTableClasses(
            mergedProps.layout as "fit" | "overflow" | undefined
          )}
        >
          <ColGroup />
          <thead class="sticky top-0 z-10">
            <tr>
              <For each={processedColumns()}>
                {(column) => {
                  const sortDirection = createMemo(() =>
                    getSortDirectionForKey(column.accessorKey)
                  );
                  return (
                    <th
                      style={column.style}
                      class={twMerge(
                        getHeaderClasses(
                          mergedProps.headerVariant as
                            | "default"
                            | "brand"
                            | undefined
                        ),
                        column.enableSorting && "cursor-pointer select-none",
                        column.isLastPinned &&
                          "shadow-[4px_0_4px_-2px_rgba(0,0,0,0.1)]",
                        "group relative"
                      )}
                      onClick={(e) =>
                        column.enableSorting &&
                        handleSort(column.accessorKey, e)
                      }
                      onMouseDown={(e) => {
                        props.onHeaderMouseDown?.(e);
                      }}
                    >
                      <div class="flex items-center justify-between gap-2">
                        <span>{column.header}</span>
                        <div class="flex items-center">
                          <Show when={sortDirection()}>
                            <Show
                              when={sortDirection() === "asc"}
                              fallback={<BiRegularDownArrow />}
                            >
                              <BiRegularUpArrow />
                            </Show>
                          </Show>
                          <Show when={mergedProps.enableColumnPinning}>
                            <span
                              class="ml-2 cursor-pointer text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePinColumn(column.accessorKey);
                              }}
                            >
                              <Show
                                when={column.isPinned}
                                fallback={<BiRegularPin />}
                              >
                                <BiSolidPin class="text-[var(--brand-color)]" />
                              </Show>
                            </span>
                          </Show>
                        </div>
                      </div>
                    </th>
                  );
                }}
              </For>
            </tr>
          </thead>
          <tbody>
            <Show when={virtualizer().paddingTop > 0}>
              <tr>
                <td
                  colspan={mergedProps.columns.length}
                  style={{
                    height: `${virtualizer().paddingTop}px`,
                    padding: 0,
                  }}
                />
              </tr>
            </Show>
            <For each={virtualizer().items}>
              {(row) => {
                // isActiveの定義：trとtdの両方で使えるようにする
                const isActive = () => {
                  const key = mergedProps.rowKey;
                  const activeRowData = mergedProps.activeRow;
                  const currentRowData = row.data;

                  if (!activeRowData || !currentRowData) return false;

                  if (key) {
                    return currentRowData[key] === activeRowData[key];
                  }
                  return currentRowData === activeRowData;
                };

                return (
                  <tr
                    class={getRowClasses(
                      mergedProps.showRowBorder,
                      mergedProps.onRowClick
                    )}
                    onClick={() => mergedProps.onRowClick?.(row.data)}
                    style={{ height: `${mergedProps.rowHeight}px` }}
                    // data-active属性を追加して、CSSやJSからアクティブ行を特定しやすくする
                    data-active={isActive()}
                  >
                    <For each={processedColumns()}>
                      {(column) => {
                        return (
                          <td
                            style={column.style}
                            class={getCellClasses(
                              mergedProps.striped,
                              row.index,
                              column.isLastPinned,
                              isActive()
                            )}
                          >
                            {column.cell(row.data)}
                          </td>
                        );
                      }}
                    </For>
                  </tr>
                );
              }}
            </For>
            <Show when={virtualizer().paddingBottom > 0}>
              <tr>
                <td
                  colspan={mergedProps.columns.length}
                  style={{
                    height: `${virtualizer().paddingBottom}px`,
                    padding: 0,
                  }}
                />
              </tr>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
