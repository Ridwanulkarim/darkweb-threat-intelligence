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
          bg: '#070b14',
          card: '#0d1322',
          cardHover: '#131b2e',
          border: '#1f2d48',
          borderHover: '#2d3f66',
          primary: '#00f2fe',
          primaryGlow: 'rgba(0, 242, 254, 0.15)',
          accent: '#00d2ff',
          success: '#00f5a0',
          warning: '#fbbf24',
          danger: '#ff3366',
          purple: '#a855f7',
          muted: '#64748b',
          text: '#f1f5f9',
          subtext: '#94a3b8'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'cyber-sm': '0 0 10px rgba(0, 242, 254, 0.1)',
        'cyber-md': '0 0 20px rgba(0, 242, 254, 0.2)',
        'cyber-danger': '0 0 20px rgba(255, 51, 102, 0.25)',
        'cyber-success': '0 0 20px rgba(0, 245, 160, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
