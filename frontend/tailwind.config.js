/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Core dark palette
        void: '#030508',
        deep: '#080d14',
        surface: '#0e1520',
        elevated: '#131d2e',
        border: '#1e2d42',
        // Accent — electric cyan
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          glow: 'rgba(6,182,212,0.3)',
        },
        // Text
        muted: '#4a6080',
        subtle: '#8aabb5',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'pulse-ring-2': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite 0.5s',
        'pulse-ring-3': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite 1s',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(6,182,212,0.25)',
        'glow-sm': '0 0 20px rgba(6,182,212,0.2)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};

