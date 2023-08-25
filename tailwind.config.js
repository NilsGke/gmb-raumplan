/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      boxShadow: {
        key: "0 2px 0 0 #bbbbbb",
      },
    },
  },
  plugins: [],
};
