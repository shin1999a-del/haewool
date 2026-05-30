import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory:    '#FDFBF7',
        'ivory-2': '#F4F1EA',
        charcoal: '#2C2A29',
        'warm-brown': '#6B4226',
        tan:      '#C4A882',
        'tan-light': '#E8DED0',
        copper:   '#A0704A',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Noto Serif KR', 'Georgia', 'serif'],
        sans:  ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
