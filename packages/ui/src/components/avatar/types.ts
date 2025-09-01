// src/components/avatar/types.ts
import type { JSX, ComponentProps } from "solid-js";
import type { VariantProps } from "class-variance-authority";
import { avatarVariants } from "./variants";

export interface AvatarProps
  extends ComponentProps<"div">, // <div>の属性を継承
    VariantProps<typeof avatarVariants> {
  // cvaからsizeの型を注入
  /** アバター画像のURL */
  src?: string;
  /** 画像のaltテキスト */
  alt?: string;
  /** 画像の読み込み失敗時に表示するフォールバック要素（例: イニシャルなど） */
  fallback?: JSX.Element;
}
