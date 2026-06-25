/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B3FA0',
          50: '#F3EDF9',
          100: '#E4D4F4',
          200: '#C9A9E9',
          300: '#AE7EDE',
          400: '#9353D3',
          500: '#6B3FA0',
          600: '#5A3486',
          700: '#48296B',
          800: '#371F51',
          900: '#251436',
        },
        secondary: {
          DEFAULT: '#1D9E75',
          50: '#E8F7F2',
          100: '#C5EBE0',
          200: '#8DD7C1',
          300: '#56C3A2',
          400: '#2FB089',
          500: '#1D9E75',
          600: '#178560',
          700: '#126C4D',
          800: '#0C5239',
          900: '#073926',
        },
        accent: {
          DEFAULT: '#E65100',
          50: '#FEF0E6',
          100: '#FDD5B4',
          200: '#FBBA82',
          300: '#F99F50',
          400: '#F7841E',
          500: '#E65100',
          600: '#C24500',
          700: '#9D3800',
          800: '#792C00',
          900: '#541F00',
        },
        dark: {
          bg: '#0A0A0F',
          surface: '#12121A',
          card: '#1A1A26',
          border: '#2A2A3E',
          muted: '#3A3A52',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F8F7FF',
          card: '#F0EDF9',
          border: '#E2DDF0',
          muted: '#8B87A0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradientX 5s ease infinite',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-primary': '0 0 30px rgba(107, 63, 160, 0.4)',
        'glow-secondary': '0 0 30px rgba(29, 158, 117, 0.4)',
        'glow-accent': '0 0 30px rgba(230, 81, 0, 0.4)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 40px rgba(107, 63, 160, 0.3)',
      },
    },
  },
  plugins: [],
}
