import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // This will show up in GitHub Actions logs
  console.log('🔧 GitHub Actions Build - VITE_PRODUCTION_URL:', process.env.VITE_PRODUCTION_URL);
  console.log('🔧 GitHub Actions Build - Mode:', mode);
  
  return {
    plugins: [
      react(),
      {
        name: 'copy-404',
        closeBundle: () => {
          // Copy public/404.html to dist/404.html for GitHub Pages SPA support
          try {
            copyFileSync(resolve(__dirname, 'public/404.html'), resolve(__dirname, 'dist/404.html'));
            console.log('✅ Successfully copied public/404.html to dist/404.html for SPA routing');
          } catch (err) {
            console.error('❌ Failed to copy 404.html:', err);
          }
        }
      }
    ],
    base: "/", // Changed from "/72X_applicants/"
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://oxabqoodvqvqskrztrsq.supabase.co'),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc'),
      'import.meta.env.VITE_PRODUCTION_URL': JSON.stringify(process.env.VITE_PRODUCTION_URL || 'http://localhost:8080')
    }
  }
})