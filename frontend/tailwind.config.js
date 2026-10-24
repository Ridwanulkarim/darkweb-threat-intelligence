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
          bg: '#060214',
          bgDarker: '#04010d',
          card: '#0e0725',
          cardHover: '#150a36',
          border: 'rgba(168, 85, 247, 0.2)',
          borderHover: 'rgba(192, 132, 252, 0.45)',
          primary: '#a855f7',
          primaryGlow: 'rgba(168, 85, 247, 0.3)',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          accent: '#00f2fe',
          success: '#00f5a0',
          warning: '#fbbf24',
          danger: '#ff3366',
          muted: '#64748b',
          text: '#f8fafc',
          subtext: '#c4b5fd'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'cyber-sm': '0 0 15px rgba(168, 85, 247, 0.25)',
        'cyber-md': '0 0 30px rgba(168, 85, 247, 0.35)',
        'cyber-purple': '0 8px 32px 0 rgba(112, 0, 255, 0.25)',
        'cyber-glow': '0 0 40px rgba(147, 51, 234, 0.4)',
        'cyber-danger': '0 0 25px rgba(255, 51, 102, 0.3)',
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
