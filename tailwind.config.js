/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#b3d9ff',
          200: '#80c1ff',
          300: '#4da9ff',
          400: '#1a91ff',
          500: '#0079e6',
          600: '#0061b3',
          700: '#004980',
          800: '#00314d',
          900: '#00191a',
        },
        accent: {
          50: '#fff4e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb84d',
          400: '#ffa41a',
          500: '#ff9000',
          600: '#cc7300',
          700: '#995600',
          800: '#663900',
          900: '#331c00',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 18px 45px rgba(0, 121, 230, 0.35)',
        'soft-glow': '0 10px 30px rgba(15, 23, 42, 0.18)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 700ms ease-out forwards',
        'fade-in-up-delayed': 'fade-in-up 900ms ease-out forwards',
        'scale-in': 'scale-in 400ms ease-out forwards',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}


