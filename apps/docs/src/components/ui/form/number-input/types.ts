// src/components/form/number-input/types.ts
import type { JSX } from "solid-js";

export interface NumberInputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value" | "onInput"> {
  value?: string | number;
  onInput?: (value: string) => void;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  isError?: boolean;
  errorMessage?: string;
  min?: number;
  max?: number;
  decimalPlaces?: number;
}
