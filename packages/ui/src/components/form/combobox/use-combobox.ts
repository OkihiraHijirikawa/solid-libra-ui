// src/components/form/combobox/use-combobox.ts
import { createSignal, createMemo, createEffect, on } from "solid-js";
import { usePopoverContext } from "../../popover/context";
import type { ComboBoxProps } from "./types";

export const useComboBox = <T extends {}>(props: ComboBoxProps<T>) => {
  const { isOpen, setIsOpen, contentEl } = usePopoverContext();
  const [inputValue, setInputValue] = createSignal("");
  const [activeItem, setActiveItem] = createSignal<T | null>(null);
  // Tableヘッダー操作中かどうかを管理するフラグ
  const [isHeaderInteracting, setIsHeaderInteracting] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;

  // props.value (外部から渡される選択値) が変更されたら、
  // Inputの表示テキストを更新するエフェクト
  createEffect(
    on(
      () => props.value,
      (value) => {
        setInputValue(value ? props.displayValue(value) : "");
      }
    )
  );

  // ポップオーバーの開閉に連動したeffect
  createEffect(() => {
    if (isOpen()) {
      // ポップオーバーが開いたときに、選択済みの値をアクティブな項目に設定する
      setActiveItem(() => props.value);
    } else {
      // ポップオーバーが閉じたときに、表示を元に戻す
      if (!props.value) {
        setInputValue("");
      } else {
        setInputValue(props.displayValue(props.value));
      }
    }
  });

  // activeItemが変更された際に、該当の行まで自動スクロールさせる
  createEffect(
    on(
      activeItem,
      (item) => {
        if (!isOpen() || !item || !contentEl()) return;

        // DOMが更新されるのを待ってから処理を実行
        requestAnimationFrame(() => {
          const activeRowEl = contentEl()?.querySelector<HTMLTableRowElement>(
            'tr[data-active="true"]'
          );
          if (activeRowEl) {
            activeRowEl.scrollIntoView({
              block: "nearest", // 要素が画面から最も近い位置に表示されるようにスクロール
              behavior: "smooth", // スムーズスクロールを有効化
            });
          }
        });
      },
      { defer: true }
    ) // defer: trueで初回実行をスキップ
  );

  // フィルタリングが有効な列を抽出
  const filterableKeys = createMemo(() =>
    props.columns
      .filter((c) => c.enableFiltering !== false)
      .map((c) => c.accessorKey)
  );

  // デフォルトのフィルタリングロジック
  const defaultFilterFn = (item: T, text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText === "") return true; // 空文字なら全件にマッチ
    // フィルタリングが有効なキーの値のみをチェックする
    return filterableKeys().some((key) =>
      String(item[key]).toLowerCase().includes(lowerText)
    );
  };

  // 表示するアイテムをフィルタリング
  const filteredItems = createMemo(() => {
    const text = inputValue();
    const filter = props.filterFn || defaultFilterFn;

    // 例外：選択中のアイテムがあり、かつ入力が変更されていない場合は全件表示
    if (props.value && props.displayValue(props.value) === text) {
      return props.items;
    }

    // 上記以外は、常に入力テキストでフィルタリングする
    return props.items.filter((item) => filter(item, text));
  });

  // Inputの入力イベントハンドラ
  const handleInput = (e: Event) => {
    const text = (e.target as HTMLInputElement).value;
    setInputValue(text);

    // ユーザーが手入力を始めたら、選択中の値をリセット
    if (props.value) {
      props.onValueChange(null);
    }
    // 入力があれば常にPopoverを開く
    if (!isOpen()) {
      setIsOpen(true);
    }
    // 入力し始めたらアクティブ行をリセット
    setActiveItem(null);
  };

  // Inputがフォーカスされたときのハンドラ
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Inputからフォーカスが外れたときのハンドラ
  const handleBlur = (e: FocusEvent) => {
    // setTimeoutを使い、クリック等の他イベントが処理されるのを待つ
    setTimeout(() => {
      // もしヘッダー操作フラグが立っていたら、Popoverを閉じずにフラグをリセットして終了
      if (isHeaderInteracting()) {
        setIsHeaderInteracting(false);
        return;
      }
      const popoverEl = contentEl();
      const currentActiveElement = document.activeElement;

      if (popoverEl && !popoverEl.contains(currentActiveElement)) {
        setIsOpen(false);
      }
    }, 100); // 150msより少し短縮して応答性を改善
  };

  // Tableの行がクリックされた時のハンドラ
  const handleRowClick = (item: T) => {
    setIsHeaderInteracting(true);
    props.onValueChange(item);
    setIsOpen(false);
  };

  const handleHeaderMouseDown = () => {
    setIsHeaderInteracting(true);

    // `blur`イベントが処理された後にフォーカスを戻すため、
    // setTimeoutで処理を遅延させる
    setTimeout(() => {
      inputRef?.focus();
    }, 100);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const items = filteredItems();
    if (!items.length) return;

    // オブジェクト参照ではなく、一意なrowKeyで比較する
    const currentIndex =
      props.rowKey && activeItem()
        ? items.findIndex(
            (item) => item[props.rowKey!] === activeItem()![props.rowKey!]
          )
        : items.findIndex((item) => item === activeItem());

    if (e.key === "ArrowDown") {
      e.preventDefault();

      // popoverが閉じている場合は開く
      if (!isOpen()) {
        setIsOpen(true);
      }

      const nextIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
      // 値を返すだけの関数でラップして、セッターの型に合わせる
      setActiveItem(() => items[nextIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      // popoverが閉じている場合は開く
      if (!isOpen()) {
        setIsOpen(true);
      }

      const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      // こちらも同様に関数でラップ
      setActiveItem(() => items[prevIndex]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      // activeItem() はシグナルのゲッターなので、そのまま使える
      if (activeItem()) {
        handleRowClick(activeItem()!);
      }
    }
  };

  // Popoverが閉じたときの処理
  createEffect(() => {
    if (!isOpen()) {
      // 選択されずにPopoverが閉じた場合、表示を元に戻す
      if (!props.value) {
        setInputValue("");
      } else {
        setInputValue(props.displayValue(props.value));
      }
    }
  });

  return {
    inputValue,
    filteredItems,
    handleInput,
    handleFocus,
    handleBlur,
    handleRowClick,
    activeItem,
    handleKeyDown,
    handleHeaderMouseDown,
    setInputRef: (el: HTMLInputElement) => (inputRef = el),
  };
};
