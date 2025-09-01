// src/components/avatar/index.tsx
import {
  createSignal,
  createEffect,
  type Component,
  type JSX,
  Show,
  mergeProps,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import { FaSolidUser } from "solid-icons/fa";
import { avatarVariants } from "./variants";
import type { AvatarProps } from "./types";

const LbAvatar: Component<AvatarProps> = (props) => {
  // cvaのデフォルトとpropsをマージ
  const mergedProps = mergeProps({ alt: "Avatar" }, props);

  // 画像を表示するかどうかの状態
  const [showImage, setShowImage] = createSignal(false);

  // srcプロパティが変更されたら、画像の表示状態をリセット
  // これにより、新しい画像URLが渡されたときに正しくローディングが試行される
  createEffect(() => {
    if (mergedProps.src) {
      setShowImage(false);
    }
  });

  // デフォルトのフォールバックアイコンを定義
  const defaultFallback = () => <FaSolidUser size={20} />;

  return (
    <div
      // cvaで生成したクラスと、ユーザーが指定したクラスをマージ
      class={twMerge(
        avatarVariants({ size: mergedProps.size }),
        mergedProps.class
      )}
    >
      <Show
        // 画像が表示可能、かつsrcが存在する場合にimg要素を描画
        when={showImage() && mergedProps.src}
        // fallbackには、ユーザー指定のものか、なければデフォルトアイコンを表示
        fallback={mergedProps.fallback || defaultFallback()}
      >
        <img
          src={mergedProps.src}
          alt={mergedProps.alt}
          class="h-full w-full object-cover"
          onLoad={() => setShowImage(true)}
          onError={() => setShowImage(false)}
        />
      </Show>
    </div>
  );
};

export default LbAvatar;
