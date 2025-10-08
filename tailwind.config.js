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
        primary: "#2563eb",
        secondary: "#475569",
        accent: "#10b981",
        surface: "#ffffff",
        background: "#f8fafc",
      },
    },
  },
  plugins: [],
};