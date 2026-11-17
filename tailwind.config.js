/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#ffffff',
        'surface-1': '#e8e8e8',
        'surface-muted': '#808080',
        'surface-dark': '#333333',
        hairline: {
          DEFAULT: '#cfd9de',
          soft: '#e8e8e8',
        },
        ink: {
          DEFAULT: '#222222',
          dark: '#0a0a0a',
          mid: '#282b3b',
          muted: '#444444',
          secondary: '#4b5563',
          tertiary: '#71767b',
          faint: '#909090',
        },
        cobalt: {
          DEFAULT: '#006be6',
          light: '#3e7ff0',
        },
        domain: {
          traffic: '#222222',
          trafficLight: '#444444',
          electricity: '#282b3b',
          electricityLight: '#4b5563',
          utilities: '#0a0a0a',
          utilitiesLight: '#71767b',
        },
        status: {
          normal: '#222222',
          warning: '#444444',
          critical: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'Menlo',
          'ui-monospace',
          'SFMono-Regular',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      borderRadius: {
        xxs: '2px',
        xs: '3px',
        sm: '4px',
        md: '5px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
  plugins: [],
};
