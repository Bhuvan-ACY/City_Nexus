/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#090909',
        surface: {
          1: '#141414',
          2: '#1c1c1c',
          3: '#242424',
        },
        hairline: {
          DEFAULT: '#262626',
          soft: '#1a1a1a',
        },
        ink: {
          DEFAULT: '#ffffff',
          muted: '#999999',
          faint: '#666666',
        },
        domain: {
          traffic: '#2563eb',
          trafficLight: '#60a5fa',
          electricity: '#d97706',
          electricityLight: '#fbbf24',
          utilities: '#0891b2',
          utilitiesLight: '#22d3ee',
        },
        status: {
          normal: '#10b981',
          warning: '#f59e0b',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
