const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF7101",
          50: "#FFF4ED",
          100: "#FFE6D5",
          200: "#FFCCAA",
          300: "#FFA574",
          400: "#FF7B3C",
          500: "#FF7101",
          600: "#E55A00",
          700: "#C14600",
          800: "#9E3700",
          900: "#822E00",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#FF7101",
              50: "#FFF4ED",
              100: "#FFE6D5",
              200: "#FFCCAA",
              300: "#FFA574",
              400: "#FF7B3C",
              500: "#FF7101",
              600: "#E55A00",
              700: "#C14600",
              800: "#9E3700",
              900: "#822E00",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#FF7101",
              50: "#FFF4ED",
              100: "#FFE6D5",
              200: "#FFCCAA",
              300: "#FFA574",
              400: "#FF7B3C",
              500: "#FF7101",
              600: "#E55A00",
              700: "#C14600",
              800: "#9E3700",
              900: "#822E00",
            },
          },
        },
      },
    }),
  ],
};
