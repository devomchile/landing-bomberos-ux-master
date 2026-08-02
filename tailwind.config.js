/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#dc3545',
          'red-dark': '#A60A27',
          'red-light': '#ff6b6b',
          blue: '#0073dd',
          'blue-dark': '#022859',
          'blue-glass': '#023e73ca',
          dark: '#343a40',
          'dark-light': '#223240',
          yellow: '#ffc107',
          green: '#28a745',
          cyan: '#17a2b8',
        },
      },
      fontFamily: {
        sans: ['"Montserrat Alternates"', 'sans-serif'],
        titillium: ['"Titillium Web"', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '12px',
        'glass-lg': '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-dark-hover': '0 16px 48px rgba(0, 0, 0, 0.4)',
        'brand-glow': '0 0 0 3px rgba(220, 53, 69, 0.12)',
      },
      borderRadius: {
        'glass': '1rem',
        'glass-lg': '1.5rem',
        'glass-xl': '2rem',
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.3s ease',
      },
      keyframes: {
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
