/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a855f7",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#2e1065"
        }
      },
      boxShadow: {
        "glass-soft":
          "0 18px 45px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(148, 163, 184, 0.35)"
      },
      backgroundImage: {
        "liquid-gradient":
          "radial-gradient(circle at 0% 0%, rgba(236,72,153,0.25), transparent 55%), radial-gradient(circle at 100% 0%, rgba(59,130,246,0.2), transparent 55%), radial-gradient(circle at 100% 100%, rgba(16,185,129,0.2), transparent 55%), radial-gradient(circle at 0% 100%, rgba(129,140,248,0.25), transparent 55%)"
      }
    }
  },
  plugins: []
};

