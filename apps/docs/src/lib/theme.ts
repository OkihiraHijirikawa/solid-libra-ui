import { createEffect, createSignal } from "solid-js";

type Theme = "light" | "dark";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const storedTheme = localStorage.getItem("theme") as Theme | null;
  if (storedTheme) return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const [theme, setTheme] = createSignal<Theme>(getInitialTheme());

createEffect(() => {
  const currentTheme = theme();
  document.documentElement.classList.toggle("dark", currentTheme === "dark");
  localStorage.setItem("theme", currentTheme);
});

export const toggleTheme = () => {
  setTheme((prev) => (prev === "light" ? "dark" : "light"));
};
