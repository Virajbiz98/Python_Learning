/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEFEF6',
          100: '#D3FCE9',
          200: '#A8F9D2',
          300: '#6FF0B8',
          400: '#36E09B',
          500: '#10CC83',
          600: '#0AA269',
          700: '#097854',
          800: '#085F44',
          900: '#064E38',
          950: '#032C20',
        },
        dark: {
          50: '#E6E8ED',
          100: '#C2C6D2',
          200: '#9AA0B4',
          300: '#717A95',
          400: '#535C7E',
          500: '#363E66',
          600: '#2B3253',
          700: '#21263F',
          800: '#16192C',
          900: '#0C0D19',
          950: '#050610',
        },
      },
      boxShadow: {
        glow: '0 0 15px rgba(16, 204, 131, 0.5)',
        'glow-lg': '0 0 30px rgba(16, 204, 131, 0.5)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};