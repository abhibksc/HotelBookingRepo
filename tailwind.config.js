/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
        animation: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
  },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        // Add more fonts here if needed
      },
      scrollbarHide: {
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none',  // IE and Edge
        'scrollbar-width': 'none',  // Firefox
      },
    },
  },
  variants: {
    extend: {
      // Extend the utilities to be used with Tailwind variants
      scrollbarHide: ['hover', 'focus'],
    },
  },
  plugins: [],
};
