/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfa',
          100: '#f8f5f1',
          200: '#f3efe6',
          300: '#e9e2d3',
          400: '#d8ceba',
          500: '#c8b7a1',
          600: '#b09b81',
          700: '#a08a73',
          800: '#82715f',
          900: '#685c4e',
        },
        terracotta: {
          50: '#fbf7f4',
          100: '#f5ebe5',
          200: '#ead7cc',
          300: '#dbbca9',
          400: '#c8a087',
          500: '#bc866a',
          600: '#ad7055',
          700: '#905a44',
          800: '#774b3a',
          900: '#613f32',
        },
        brand: {
          lightblue: '#86C5FF',
          lavender: '#D49BFF',
          pink: '#FFC9E3',
          black: '#0D0D0D',
          cyan: '#00C4CC',
          red: '#FF3C3C',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'pattern': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
        'peach-gradient': 'linear-gradient(to right, #ff9176, #ff6e4e)',
        'peach-gradient-light': 'linear-gradient(to right, #ffd7cd, #ffb7a4)',
        'hero-gradient': 'linear-gradient(to right, #86C5FF, #D49BFF)',
        'fancy-radial': 'radial-gradient(circle at top left, #86C5FF, #D49BFF, #FFC9E3)',
      },
      boxShadow: {
        soft: '0 4px 10px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        xl: '1rem',
      },
      keyframes: {
        'gradient-move': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-24px)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'gradient-move': 'gradient-move 8s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'float-medium': 'float-medium 5s ease-in-out infinite',
        'float-fast': 'float-fast 3s ease-in-out infinite',
        'sparkle': 'sparkle 2.5s ease-in-out infinite',
        'typewriter': 'typewriter 2.2s steps(40, end) 1 normal both',
        'spin-slow': 'spin 1.2s linear infinite',
      },
    },
  },
  plugins: [],
}
