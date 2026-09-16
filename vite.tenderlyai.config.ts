// vite.tenderlyai.config.ts — TenderlyAI sub-app (localhost:5176)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'apps/tenderlyai'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5176,
    strictPort: true,
  },
  cacheDir: resolve(__dirname, 'node_modules/.vite-tenderlyai'),
  build: {
    outDir: resolve(__dirname, 'dist-tenderlyai'),
    emptyOutDir: true,
  },
})
