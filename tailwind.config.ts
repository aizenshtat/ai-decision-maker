import type { Config } from "tailwindcss";
import customPlugin from "./tailwind-plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#313131',
        },
        secondary: {
          50: '#f0f7ff',
          100: '#d1e0f0',
          200: '#b3c9e0',
          300: '#95b2d1',
          400: '#779bc1',
          500: '#5985b1',
          600: '#476a8e',
          700: '#35506b',
          800: '#243648',
          900: '#121b24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    customPlugin
  ],
};

export default config;