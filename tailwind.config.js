/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f7ee',
          100: '#c6ecd5',
          500: '#128C4A',
          600: '#0F7A40',
          700: '#0C6335',
        },
      },
    },
  },
  plugins: [],
};
