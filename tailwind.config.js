export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#9333ea",
        secondary: "#475569",
        accent: "#10b981",
        surface: "#ffffff",
        background: "#f8fafc",
      },
    },
  },
  plugins: [],
};