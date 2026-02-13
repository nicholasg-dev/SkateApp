import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // React core — changes rarely, cached well
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Recharts is ~300kB and only used on Dashboard
            'vendor-recharts': ['recharts'],
          },
        },
      },
    },
    define: {},
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
