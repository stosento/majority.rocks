/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'delicious': ['Delicious Handrawn', 'sans-serif'],
        'teko': ['Teko', 'sans-serif'],
        'alkatra': ['Alkatra', 'sans-serif']
      }
    },
  },
  plugins: [],
}

