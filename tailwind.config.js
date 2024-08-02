// tailwind.config.js

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            ol: {
              paddingLeft: '1.25em',
            },
            ul: {
              paddingLeft: '1.25em',
            },
          },
        },
      },
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#bdd6ff',
          200: '#94bcff',
          300: '#6ba2ff',
          400: '#4288ff',
          500: '#196eff',
          600: '#0054e6',
          700: '#003db3',
          800: '#002680',
          900: '#00104d',
        },
        secondary: {
          50: '#f7f7f7',
          100: '#d9d9d9',
          200: '#b3b3b3',
          300: '#8f8f8f',
          400: '#666666',
          500: '#4c4c4c',
          600: '#333333',
          700: '#1a1a1a',
          800: '#0d0d0d',
          900: '#050505',
        },
        accent: {
          50: '#ff69b4',
          100: '#ff7ac9',
          200: '#ff8bcf',
          300: '#ff99d4',
          400: '#ffa6d9',
          500: '#ffafee',
          600: '#ffbbf3',
          700: '#ffccf8',
          800: '#ffdeff',
          900: '#ffefff',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
  ],
}