import typography from '@tailwindcss/typography'

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
          brown: '#4E342E',
          terracotta: '#D84315',
          cream: '#FFF8E1',
          olive: '#6D8B74',
        },
        gradient: {
          hero: 'linear-gradient(135deg, #4E342E 0%, #D84315 50%, #6D8B74 100%)',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(78, 52, 46, 0.1)',
        'hover': '0 20px 40px rgba(216, 67, 21, 0.15)',
      }
    },
  },
  plugins: [
    typography,
  ],
}

