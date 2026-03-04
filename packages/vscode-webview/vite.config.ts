import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
    plugins: [svelte()],
    build: {
        lib: {
            entry: "src/main.ts",
            formats: ["iife"], // important — webviews need a single self-executing bundle
            name: "Webview",
        },
        outDir: "../vscode-extension/dist",
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                assetFileNames: "webview.[ext]",
                entryFileNames: "webview.js",
            },
        },
    },
});
