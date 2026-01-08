import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stripe: {
          downriver: '#0A2540',
          'black-squeeze': '#F6F9FC',
          'cornflower-blue': '#635BFF',
        },
        badge: {
          red: "#ef4444",
          orange: "#f97316",
          yellow: "#eab308",
          lightgreen: "#86efac",
          green: "#22c55e",
          blue: "#3b82f6",
          purple: "#8b5cf6",
        },
        dark: {
          bg: '#0B0B0B',
          accent: '#6366F1',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

