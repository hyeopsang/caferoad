/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    borderRadius: {
      taste: "52% 48% 55% 45% / 43% 58% 42% 57%",
      mood: "59% 41% 41% 59% / 49% 38% 62% 51%",
      kind: "48% 52% 51% 49% / 37% 38% 62% 63%",
      comfort: "66% 34% 61% 39% / 37% 38% 62% 63% ",
      wifi: "68% 32% 34% 66% / 46% 61% 39% 54%",
      parking: "56% 44% 66% 34% / 46% 61% 39% 54% ",
    },
    extend: {},
  },
  plugins: [require("daisyui")],
};
