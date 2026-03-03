import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  console.log('🔧 Building with VITE_PRODUCTION_URL:', process.env.VITE_PRODUCTION_URL);
  
  return {
    plugins: [react()],
    base: "/72X_applicants/",
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://oxabqoodvqvqskrztrsq.supabase.co'),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YWJxb29kdnF2cXNrcnp0cnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzI1MzQsImV4cCI6MjA3NjI0ODUzNH0._BdnLDSSe003i83nf_vfnHMlGJSQdjcfEcKvmlyfqSc'),
      'import.meta.env.VITE_PRODUCTION_URL': JSON.stringify(process.env.VITE_PRODUCTION_URL || 'http://localhost:8080'),
      // Override Paystack's hardcoded localhost
      'process.env.PAYSTACK_CHECKOUT_URL': JSON.stringify('https://checkout.paystack.com'),
    }
  }
})