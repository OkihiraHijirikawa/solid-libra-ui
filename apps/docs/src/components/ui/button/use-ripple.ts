import type { JSX } from "solid-js";

export const useRipple = () => {
  const createRipple: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    const element = e.currentTarget;

    // 古いリップルを削除
    const oldRipple = element.querySelector(".ripple");
    if (oldRipple) oldRipple.remove();

    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    // クリック位置の計算をより正確に
    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    element.appendChild(circle);
  };

  return { createRipple };
};
