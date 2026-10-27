/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          500: '#3b6fe0',
          600: '#2b55c7',
          700: '#2142a0',
        },
      },
    },
  },
  plugins: [],
};
