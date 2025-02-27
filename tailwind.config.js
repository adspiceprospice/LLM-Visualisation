/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      width: {
        '1/5': '20%',
        '3/5': '60%',
      },
      boxShadow: {
        'glow': '0 0 10px rgba(80, 120, 200, 0.6)',
      },
      borderColor: {
        'blue-accent': 'rgba(60, 100, 170, 0.5)',
      },
      backgroundColor: {
        'panel': 'rgba(21, 26, 37, 0.9)',
      },
    },
  },
  plugins: [],
} 