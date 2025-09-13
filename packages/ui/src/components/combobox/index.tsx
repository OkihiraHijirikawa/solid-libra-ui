// src/components/forms/combobox/index.tsx
import { type Component, mergeProps } from "solid-js";
import { AiOutlineSearch } from "solid-icons/ai";
import { twMerge } from "tailwind-merge";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";
import Table from "../table";
import Input from "../input";
import { useComboBox } from "./use-combobox";
import type { ComboBoxProps } from "./types";

const ComboBoxContent = <T extends {}>(props: ComboBoxProps<T>) => {
  const {
    inputValue,
    filteredItems,
    activeItem,
    handleInput,
    handleFocus,
    handleBlur,
    handleRowClick,
    handleKeyDown,
    handleHeaderMouseDown,
    setInputRef,
  } = useComboBox(props);

  return (
    <>
      <PopoverTrigger>
        <div onKeyDown={handleKeyDown}>
          <Input
            value={inputValue()}
            ref={setInputRef}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={props.placeholder}
            icon={<AiOutlineSearch />}
            iconPosition="right"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent placement="bottom-start">
        <Table<T>
          data={filteredItems()}
          columns={props.columns}
          enableFiltering={false}
          enableColumnPinning={false}
          headerVariant="brand"
          striped={true}
          layout="overflow"
          rowHeight={36}
          rowKey={props.rowKey}
          activeRow={activeItem()}
          class={twMerge(
            "text-sm w-[600px] h-[300px]", // デフォルトのクラス
            props.contentClass // 外部から渡された上書き用のクラス
          )}
          onRowClick={handleRowClick}
          onHeaderMouseDown={handleHeaderMouseDown}
        />
      </PopoverContent>
    </>
  );
};

const ComboBox = <T extends {}>(props: ComboBoxProps<T>) => {
  const mergedProps = mergeProps({ placeholder: "検索して選択..." }, props);

  return (
    <Popover>
      <ComboBoxContent {...mergedProps} />
    </Popover>
  );
};

export default ComboBox;
