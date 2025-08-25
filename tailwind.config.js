/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'csp-green': '#0e9246',
        'csp-blue': '#467A8f',
        'csp-lime': '#d7df21',
        'csp-orange': '#fbae42',
        'csp-light-blue': '#5c98af',
        'csp-gray': '#999fa9',
      },
      fontFamily: {
        'header': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

