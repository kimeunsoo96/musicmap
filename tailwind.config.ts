import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1117',
          light: '#1a1b23',
          hover: '#252833',
        },
        spotify: {
          DEFAULT: '#1DB954',
          dark: '#1aa34a',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          dim: '#6d42c9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
