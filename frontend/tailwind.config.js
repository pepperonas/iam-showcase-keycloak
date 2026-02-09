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
        // MD3 Surface & Background
        surface: {
          DEFAULT: '#fef7ff',
          dim: '#ded8e1',
          bright: '#fef7ff',
          'container-lowest': '#ffffff',
          'container-low': '#f7f2fa',
          container: '#f3edf7',
          'container-high': '#ece6f0',
          'container-highest': '#e6e0e9',
        },
        'on-surface': {
          DEFAULT: '#1d1b20',
          variant: '#49454f',
        },
        // MD3 Primary
        'md-primary': {
          DEFAULT: '#6750a4',
          container: '#eaddff',
          fixed: '#eaddff',
          'fixed-dim': '#d0bcff',
        },
        'on-primary': {
          DEFAULT: '#ffffff',
          container: '#21005d',
          fixed: '#21005d',
          'fixed-variant': '#4f378b',
        },
        // MD3 Secondary
        secondary: {
          DEFAULT: '#625b71',
          container: '#e8def8',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#625b71',
          600: '#4a4458',
          700: '#332d41',
          800: '#1d192b',
          900: '#0f0d13',
        },
        'on-secondary': {
          DEFAULT: '#ffffff',
          container: '#1d192b',
        },
        // MD3 Tertiary
        tertiary: {
          DEFAULT: '#7d5260',
          container: '#ffd8e4',
        },
        'on-tertiary': {
          DEFAULT: '#ffffff',
          container: '#31111d',
        },
        // MD3 Error
        'md-error': {
          DEFAULT: '#b3261e',
          container: '#f9dedc',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#410e0b',
        },
        // MD3 Outline
        outline: {
          DEFAULT: '#79747e',
          variant: '#cac4d0',
        },
        // MD3 Inverse
        'inverse-surface': '#322f35',
        'inverse-on-surface': '#f5eff7',
        'inverse-primary': '#d0bcff',
        // MD3 Scrim
        scrim: '#000000',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // MD3 Type Scale
        'display-lg': ['3.5625rem', { lineHeight: '4rem', fontWeight: '400', letterSpacing: '-0.016em' }],
        'display-md': ['2.8125rem', { lineHeight: '3.25rem', fontWeight: '400' }],
        'display-sm': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '400' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '400' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '400' }],
        'headline-sm': ['1.5rem', { lineHeight: '2rem', fontWeight: '400' }],
        'title-lg': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'title-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '500', letterSpacing: '0.009em' }],
        'title-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.007em' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '0.031em' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400', letterSpacing: '0.016em' }],
        'body-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '400', letterSpacing: '0.033em' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.007em' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', fontWeight: '500', letterSpacing: '0.042em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1rem', fontWeight: '500', letterSpacing: '0.042em' }],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '28px',
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)',
        'elevation-2': '0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)',
        'elevation-3': '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px 0 rgba(0,0,0,0.3)',
        'elevation-4': '0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px 0 rgba(0,0,0,0.3)',
        'elevation-5': '0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px 0 rgba(0,0,0,0.3)',
      },
      transitionTimingFunction: {
        'md3-standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'md3-decelerate': 'cubic-bezier(0, 0, 0, 1)',
        'md3-accelerate': 'cubic-bezier(0.3, 0, 1, 1)',
      },
      transitionDuration: {
        'md3-short': '200ms',
        'md3-medium': '300ms',
        'md3-long': '500ms',
      },
    },
  },
  plugins: [],
}
