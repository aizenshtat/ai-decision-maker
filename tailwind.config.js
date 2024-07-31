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
        // Add other color palettes as needed
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}