/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1a73e8',
          600: '#1557b0',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a5f',
        },
      },
    },
  },
  plugins: [],
}
