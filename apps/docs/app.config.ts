import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    baseURL: process.env.BASE_URL,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
