// src/utils/date.ts

/**
 * Dateオブジェクトを 'YYYY-MM-DD' 形式の文字列に変換します。
 * @param date - 変換するDateオブジェクト
 * @returns 'YYYY-MM-DD' 形式の文字列
 */
export const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
