import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/static/",
    plugins: [react()],
    build: {
        manifest: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            input: "/src/main.tsx",
        },
    },
    server: {
        origin: process.env.VITE_SERVER_ORIGIN,
    },
});
