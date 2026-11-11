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
        studio: {
          dark: '#051A24',
          heading: '#0D212C',
          muted: '#273C46',
          light: '#F6FCFF',
          subtle: '#E0EBF0',
        },
        midnight: {
          950: '#05070b',
          900: '#090d16',
          800: '#0f172a',
          700: '#15203b',
          600: '#1e293b',
        },
        navy: {
          900: '#0c1322',
          800: '#111c34',
          700: '#172545',
          600: '#1e3059',
        },
        electric: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        marhas: {
          blue: '#1d4ed8',
          sky: '#0284c7',
          yellow: '#facc15',
          amber: '#f59e0b',
          emerald: '#10b981',
          coral: '#f97316',
          cream: '#faf8f5',
        }
      },
      fontFamily: {
        neue: ['"PP Neue Montreal"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mondwest: ['"PP Mondwest"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        geist: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        silkscreen: ['"Silkscreen"', 'cursive'],
        sans: ['"PP Neue Montreal"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'btn-primary': '0 1px 2px 0 rgba(5,26,36,0.1), 0 4px 4px 0 rgba(5,26,36,0.09), 0 9px 6px 0 rgba(5,26,36,0.05), 0 17px 7px 0 rgba(5,26,36,0.01), 0 26px 7px 0 rgba(5,26,36,0), inset 0 2px 8px 0 rgba(255,255,255,0.5)',
        'btn-secondary': '0 0 0 0.5px rgba(0,0,0,0.05), 0 4px 30px rgba(0,0,0,0.08)',
        'btn-tertiary': '0 0 0 0.5px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.08)',
        'floating-nav': '0 0 0 0.5px rgba(0,0,0,0.05), 0 10px 40px -10px rgba(5,26,36,0.15), 0 2px 10px -2px rgba(5,26,36,0.05)',
        'glow-blue': '0 0 25px -5px rgba(14, 165, 233, 0.3)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'tactile': '0 6px 0 0 #0f172a',
        'tactile-sm': '0 4px 0 0 #0f172a',
        'tactile-blue': '0 6px 0 0 #1e3a8a',
      }
    },
  },
  plugins: [],
}
