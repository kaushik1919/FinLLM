/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}',
    './src/stores/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0a0a0b',
          surface: '#111115',
          elevated: '#18181f',
          hover: '#222230',
        },
        border: {
          subtle: '#1e1e2a',
          DEFAULT: '#2a2a38',
          strong: '#3a3a50',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#8888a8',
          muted: '#55556e',
        },
        accent: {
          DEFAULT: '#4f8eff',
          hover: '#6ba3ff',
          subtle: 'rgba(79,142,255,0.10)',
        },
        citation: {
          DEFAULT: '#a78bfa',
          subtle: 'rgba(167,139,250,0.10)',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '1.4' }],
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.6' }],
        lg: ['15px', { lineHeight: '1.6' }],
        xl: ['16px', { lineHeight: '1.5' }],
        '2xl': ['18px', { lineHeight: '1.4' }],
        '3xl': ['22px', { lineHeight: '1.3' }],
        '4xl': ['28px', { lineHeight: '1.2' }],
      },
      spacing: {
        sidebar: '240px',
        topbar: '48px',
        'source-panel': '320px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'pulse-dot': 'pulseDot 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
