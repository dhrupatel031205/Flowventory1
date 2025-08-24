/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // Make Tailwind utilities override Bootstrap where they conflict
  important: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Light theme colors
        light: {
          bg: '#f9fafb',
          text: '#111827',
          card: '#ffffff',
          primary: '#2563eb',
          secondary: '#10b981',
          muted: '#6b7280',
          border: '#e5e7eb',
          hover: '#f3f4f6',
        },
        // Dark theme colors
        dark: {
          bg: '#0f172a',
          text: '#f9fafb',
          card: '#1e293b',
          primary: '#3b82f6',
          secondary: '#34d399',
          muted: '#9ca3af',
          border: '#334155',
          hover: '#1e293b',
        },
        // Status colors
        status: {
          pending: '#f59e0b',
          shipped: '#3b82f6',
          delivered: '#10b981',
          cancelled: '#ef4444',
        },
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 8px 25px -5px rgba(0,0,0,0.12)',
        'soft-hover': '0 16px 35px -10px rgba(0,0,0,0.25)',
        'dark-soft': '0 8px 25px -5px rgba(0,0,0,0.3)',
        'dark-soft-hover': '0 16px 35px -10px rgba(0,0,0,0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};