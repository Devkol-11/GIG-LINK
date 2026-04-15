/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        accent: "#10B981",
        dark: "#0F172A",
        light: "#FFFFFF",
      },
      borderRadius: {
        md: 8,
        lg: 12,
      },
    },
  },
  plugins: [],
};
