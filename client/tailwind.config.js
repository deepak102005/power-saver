/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        primary: {
          DEFAULT: '#22A06B',
          hover: '#1B8055',
          light: '#E7F5EF'
        },
        accent: {
          DEFAULT: '#F5A623',
          hover: '#E0961E',
          light: '#FEF6E9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
