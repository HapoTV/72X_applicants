// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.VITE_GITHUB_PAGES === 'true'
  
  // For custom domain, use root path
  const base = '/'

  return {
    plugins: [
      react(),
      {
        name: 'copy-404',
        closeBundle: () => {
          try {
            copyFileSync(resolve(__dirname, 'public/404.html'), resolve(__dirname, 'dist/404.html'));
          } catch (err) {
            console.error('Failed to copy 404.html:', err);
          }
        }
      }
    ],
    base: base,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      // Ensure only one copy of React is used across all imports
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://oxabqoodvqvqskrztrsq.supabase.co'),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc'),
      'import.meta.env.VITE_PRODUCTION_URL': JSON.stringify(process.env.VITE_PRODUCTION_URL || 'https://api.72x.co.za')
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Ensure the entry point is correctly resolved
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            'vendor-mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-charts': ['recharts'],
            'vendor-radix': [
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-label',
              '@radix-ui/react-select',
              '@radix-ui/react-slot',
              '@radix-ui/react-toast',
              '@radix-ui/react-tooltip',
            ],
            'vendor-utils': ['axios', 'date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          },
        },
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    cacheDir: 'node_modules/.vite-main',
  }
})