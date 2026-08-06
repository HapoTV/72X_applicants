// vite.finance.config.ts — Finance Manager sub-app (localhost:5175)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'apps/finance'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    outDir: resolve(__dirname, 'dist-finance'),
    emptyOutDir: true,
  },
})
