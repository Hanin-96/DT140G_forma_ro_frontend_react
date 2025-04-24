/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Text: ['"Source Sans 3"', 'sans-serif'],
        Titles: ['"DM Serif Display"', 'exportserif']
      },
      fontSize: {
        forma_ro_text: ["16px", { lineHeight: "24px" }],
        forma_ro_h1: ["42px", { lineHeight: "48px" }]
      },
      colors: {
        forma_ro_green: "#8A987A",
        forma_ro_black: "#1e1e1e"
      },
      maxWidth: {
        width_1000: "1000px",
      },
    }

  },
  plugins: [],
};

