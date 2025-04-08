/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        'primary': '#a445ed',
      },
      fontFamily: {
        custom: ['fantastica', 'poppins', 'Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}