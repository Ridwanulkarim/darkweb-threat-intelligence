/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030305',
          bgDarker: '#000000',
          card: '#0a0408',
          cardHover: '#14070e',
          border: 'rgba(239, 68, 68, 0.2)',
          borderHover: 'rgba(248, 113, 113, 0.45)',
          primary: '#ef4444',
          primaryGlow: 'rgba(239, 68, 68, 0.35)',
          violet: '#f43f5e',
          indigo: '#e11d48',
          accent: '#00f2fe',
          success: '#00f5a0',
          warning: '#fbbf24',
          danger: '#dc2626',
          muted: '#71717a',
          text: '#f8fafc',
          subtext: '#fca5a5'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'cyber-sm': '0 0 15px rgba(239, 68, 68, 0.25)',
        'cyber-md': '0 0 30px rgba(239, 68, 68, 0.35)',
        'cyber-purple': '0 8px 32px 0 rgba(220, 38, 38, 0.25)',
        'cyber-glow': '0 0 40px rgba(220, 38, 38, 0.4)',
        'cyber-danger': '0 0 25px rgba(239, 68, 68, 0.35)',
        'cyber-success': '0 0 25px rgba(0, 245, 160, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'glow-float': 'glowFloat 6s ease-in-out infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowFloat: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
