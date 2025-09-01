// src/components/form/number-input/use-number-input.ts
import { createMemo, createSignal, on, type JSX } from "solid-js";
import { formatNumber } from "./number-util";
import type { NumberInputProps } from "./types";

export const useNumberInput = (props: NumberInputProps) => {
  const initialValue =
    props.value !== undefined && props.value !== null
      ? String(props.value)
      : "";
  const [displayValue, setDisplayValue] = createSignal("");
  // カンマを含まない、内部で保持する純粋な数値文字列
  const [internalValue, setInternalValue] = createSignal("");

  // props.valueが外部から変更された場合、表示を更新する
  createMemo(
    on(
      () => props.value,
      (value) => {
        // 初期化処理と重複しないように、現在の内部値と比較する
        if (
          value !== undefined &&
          value !== null &&
          String(value) !== internalValue()
        ) {
          const stringValue = String(value).replace(/,/g, "");
          const formatted = formatNumber(stringValue, props.decimalPlaces);
          setDisplayValue(formatted);
          setInternalValue(stringValue);
        } else if (value === undefined || value === null || value === "") {
          setDisplayValue("");
          setInternalValue("");
        }
      }
    )
  ); // 初期レンダリング時の重複実行を避ける

  // フォーカス時：カンマを取り除き、全選択する
  const handleFocus: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    setDisplayValue(internalValue());
    e.currentTarget.select();
  };

  // フォーカスが外れた時：カンマ区切りにフォーマットする
  const handleBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = (e) => {
    const value = internalValue();
    if (value.trim() === "" || value === "-") {
      setDisplayValue("");
      setInternalValue("");
      props.onInput?.(""); // 外部にも空であることを通知
      return;
    }
    setDisplayValue(formatNumber(value, props.decimalPlaces));
  };

  // 入力中の処理
  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const inputElement = e.currentTarget;
    let value = inputElement.value;
    const cursorPosition = inputElement.selectionStart;

    // 全角を半角に変換
    value = value.replace(/[０-９．。]/g, (s) =>
      s === "．" || s === "。"
        ? "."
        : String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );

    // カンマを除去
    const valueWithoutCommas = value.replace(/,/g, "");

    // 小数点の桁数に応じた正規表現でバリデーション
    const decimalPlaces = props.decimalPlaces ?? 0;
    const regex =
      decimalPlaces > 0
        ? new RegExp(`^-?([0-9]*)(\\.?([0-9]{0,${decimalPlaces}}))?$`)
        : /^-?[0-9]*$/;

    // バリデーションに合格した場合のみ値を更新
    if (regex.test(valueWithoutCommas) || valueWithoutCommas === "") {
      let numericValue = parseFloat(valueWithoutCommas);
      let validatedValue = valueWithoutCommas;

      // min/max の範囲チェック
      if (!isNaN(numericValue)) {
        if (props.min !== undefined && numericValue < props.min) {
          numericValue = props.min;
          validatedValue = String(numericValue);
        }
        if (props.max !== undefined && numericValue > props.max) {
          numericValue = props.max;
          validatedValue = String(numericValue);
        }
      }

      // 状態を更新
      setInternalValue(validatedValue);
      setDisplayValue(validatedValue);

      // 外部に値を通知
      props.onInput?.(validatedValue);

      // カーソル位置を調整 (非同期でDOM更新後に実行)
      queueMicrotask(() => {
        if (cursorPosition !== null) {
          inputElement.setSelectionRange(cursorPosition, cursorPosition);
        }
      });
    } else {
      // バリデーションに失敗した場合、入力を元に戻す
      const oldValue = displayValue();
      inputElement.value = oldValue;
      // カーソル位置を一つ前に戻す
      if (cursorPosition !== null) {
        inputElement.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      }
    }
  };

  return { displayValue, handleFocus, handleBlur, handleInput };
};
