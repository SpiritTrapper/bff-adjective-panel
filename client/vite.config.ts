import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    tailwindcss(),
    svgr({
      include: "src/assets/images/**/*.svg",
      svgrOptions: {
        icon: true,
        expandProps: "end",
        svgoConfig: { plugins: [{ name: "removeDimensions", active: true }] },
      },
    }),
  ],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@images": path.resolve(__dirname, "src/assets/images"),
      "@i18n": path.resolve(__dirname, "src/i18n"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-table",
      "date-fns",
      "lucide-react",
      "sonner",
      "js-cookie",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
    esbuildOptions: { target: "es2022" },
  },
  envDir: "../",
  css: { devSourcemap: false },
  server: {
    port: 4000,
    strictPort: true,
    proxy: { "/api": { target: "http://localhost:3000", changeOrigin: true, secure: false } },
    watch: { ignored: ["**/dist/**"] },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    cssMinify: "lightningcss",
    sourcemap: false,
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          radix: [
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          table: ["@tanstack/react-table"],
          date: ["date-fns"],
          icons: ["lucide-react"],
          toast: ["sonner"],
          form: ["react-hook-form", "@hookform/resolvers", "yup"],
          color: ["react-colorful"],
          i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
      },
    },
  },
  preview: { port: 5173, strictPort: true },
});
