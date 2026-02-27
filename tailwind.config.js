export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // map CSS variables so Tailwind utilities can reference them
        bg: 'var(--bg)',
        text: 'var(--text)',
        primary: 'var(--primary)'
      }
    }
  },
  plugins: [],
}
