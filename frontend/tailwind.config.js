/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeSlide: "fadeSlide 2s ease-out",
      },
      keyframes: {
        fadeSlide: {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          
          "50%": { opacity: "1", transform: "translateY(0)" },
          
          "100%": { opacity: "1", transform: "translateX(10px)" },
        },
      },
    },
  },
  plugins: [],
};
