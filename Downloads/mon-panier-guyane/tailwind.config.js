/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        green: {
          brand: '#1a6b2f',
          dark: '#134f22',
          mid: '#228b3c',
          light: '#2da84a',
          pale: '#e8f5ec',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'serif'],
      },
    },
  },
  plugins: [],
}
