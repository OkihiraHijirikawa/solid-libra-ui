// apps/docs/src/components/AppHeader/index.tsx

import type { Component } from "solid-js";
import { AiFillGithub } from "solid-icons/ai";
import { ThemeToggle } from "../ThemeToggle";

export const AppHeader: Component = () => {
  return (
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div class="container flex h-14 items-center">
        <div class="mr-4 flex">
          <a href="/" class="mx-10 flex items-center space-x-2">
            <img
              src="/LibraUI.png"
              alt="solid-libra-ui Logo"
              class="h-12 w-12"
            />
            <span class="font-bold">Libra UI</span>
          </a>
          <nav class="flex items-center space-x-6 text-sm font-medium">
            <a
              href="/docs"
              class="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Docs
            </a>
            <a
              href="/components"
              class="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Components
            </a>
          </nav>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-4">
          <nav class="flex items-center mr-10">
            <a
              href="https://github.com/OkihiraHijirikawa/solid-libra-ui"
              target="_blank"
              rel="noreferrer"
            >
              <AiFillGithub class="h-8 w-8" />
              <span class="sr-only">GitHub</span>
            </a>
            {/* <ThemeToggle /> */}
          </nav>
        </div>
      </div>
    </header>
  );
};
