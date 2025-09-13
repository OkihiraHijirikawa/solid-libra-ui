import { A } from "@solidjs/router";
import {
  HiOutlineArrowRight,
  HiOutlineClipboardDocument,
} from "solid-icons/hi";
import Button from "~/components/ui/button";

export default function Home() {
  const installCommand = "pnpm dlx solid-libra-ui@latest init";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommand).then(
      () => {
        alert("Copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <main class="flex-1">
      <div class="container relative pb-10">
        {/* ヒーローセクション */}
        <section class="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 class="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            SolidJSの力を解放する、美しいUIコンポーネント
          </h1>
          <p class="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
            solid-libra-uiは、あなたのプロジェクトに簡単に組み込める、プロダクション品質のヘッドレスUIコンポーネント群です。
            カスタマイズ性に優れ、アクセシビリティも考慮されています。
          </p>
          <div class="mt-6 flex w-full items-center justify-center space-x-4">
            <A
              href="/docs"
              class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              導入ガイド
            </A>
            <A
              href="/components"
              class="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              コンポーネント一覧 <HiOutlineArrowRight class="ml-2 h-4 w-4" />
            </A>
          </div>
        </section>

        {/* 導入コマンド */}
        <section class="mx-auto flex max-w-2xl flex-col items-center">
          <p class="mb-4 font-mono text-sm">
            プロジェクトへの導入はコマンド一つで完了します。
          </p>
          <div class="flex w-full items-center justify-between rounded-lg border bg-muted p-3 font-mono text-sm">
            <span class="text-muted-foreground">$ </span>
            <span class="flex-1 pl-2">{installCommand}</span>
            <button
              onClick={copyToClipboard}
              class="rounded-md p-1.5 transition-colors hover:bg-background"
              aria-label="Copy install command"
            >
              <HiOutlineClipboardDocument class="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
