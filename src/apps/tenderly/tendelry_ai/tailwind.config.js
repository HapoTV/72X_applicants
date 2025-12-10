/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#2a2a2a',
          text: '#ffffff',
          textSecondary: '#a0a0a0',
          accent: '#3a3a3a',
          hover: '#2a2a2a'
        }
      }
    },
  },
  plugins: [],
};
