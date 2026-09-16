// vite.crm.config.ts — CRM sub-app (localhost:5174)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'apps/crm'),
  // Allow imports from the main src/ directory
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  cacheDir: resolve(__dirname, 'node_modules/.vite-crm'),
  build: {
    outDir: resolve(__dirname, 'dist-crm'),
    emptyOutDir: true,
  },
})
