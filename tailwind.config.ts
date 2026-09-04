import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f2ff',
          100: '#ece8ff',
          200: '#d9d2ff',
          500: '#7c5cff',
          600: '#6c3ff2',
          700: '#5b2fd4',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        panel: '0 10px 40px -12px rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
