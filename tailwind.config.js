/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        zen: {
          paper: '#fcf9f2',
          card: '#ffffff',
          ink: '#073642',
          sub: '#586e75',
          muted: '#93a1a1',
          border: '#e4d9c7',
          terracotta: '#cb4b16',
          amber: '#b58900',
          teal: '#2aa198',
          well: '#f7f0e0',
        },
      },
      boxShadow: {
        'tactile': '0 20px 48px -12px rgba(7, 54, 66, 0.07), 0 4px 16px rgba(181, 137, 0, 0.04)',
        'tactile-hover': '0 24px 56px -12px rgba(7, 54, 66, 0.10), 0 6px 20px rgba(181, 137, 0, 0.06)',
        'tactile-key': '0 4px 0 #dcd3b6',
        'tactile-key-active': '0 1px 0 #dcd3b6',
      },
    },
  },
  plugins: [],
}
