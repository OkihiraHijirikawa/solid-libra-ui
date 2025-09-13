import { Component, Show } from "solid-js";
import { FiMoon, FiSun } from "solid-icons/fi";
import { theme, toggleTheme } from "../../lib/theme";

export const ThemeToggle: Component = () => {
  return (
    <button
      onClick={toggleTheme}
      class="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
      aria-label="Toggle theme"
    >
      <Show when={theme() === "dark"} fallback={<FiSun class="h-8 w-8" />}>
        <FiMoon class="h-8 w-8" />
      </Show>
    </button>
  );
};
