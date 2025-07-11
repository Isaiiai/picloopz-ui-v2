import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { mochaPlugins } from '@getmocha/vite-plugins';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      ...mochaPlugins(process.env),
      react(),
    ],

    server: {
      allowedHosts: true,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: path => path,
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 5000,
    },
  };
});
