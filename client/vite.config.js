import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/expenses': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/budgets': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/analytics': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'sw.js') {
            return 'sw.js';
          }
          return assetInfo.name;
        }
      }
    },
    // Ensure service worker is copied to dist
    copyPublicDir: true
  }
})
