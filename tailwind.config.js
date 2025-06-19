/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ["var(--font-handwriting)"],
      },
      colors: {
        "yello-yellow": "#FFF9E6",
        "yello-brown": "#8B4513",
        "yello-orange": "#D2691E",
      },
    },
  },
  plugins: [],
}; 