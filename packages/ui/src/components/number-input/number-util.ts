// src/utils/number.ts

/**
 * 小数点以下の桁数を考慮し、数値をカンマ区切りの文字列にフォーマットする関数。
 * @param value - フォーマットする数値または文字列
 * @param decimalPlaces - 表示する小数点以下の桁数
 * @returns フォーマットされた文字列
 */
export function formatNumber(
  value: number | string,
  decimalPlaces = 0
): string {
  const numericValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  if (isNaN(numericValue) || decimalPlaces < 0) {
    return "";
  }

  const multiplier = Math.pow(10, decimalPlaces);
  const truncatedValue = Math.trunc(numericValue * multiplier) / multiplier;
  const formattedValue = truncatedValue.toFixed(decimalPlaces);

  const parts = formattedValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? parts[1] : "";

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  if (decimalPlaces > 0) {
    return `${formattedIntegerPart}.${decimalPart}`;
  }

  return formattedIntegerPart;
}
