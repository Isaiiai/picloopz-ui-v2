import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mochaPlugins } from "@getmocha/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [...mochaPlugins(process.env), react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
});
