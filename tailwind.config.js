const red = { 50: "#fdf3f3", 100: "#f8dcdc", 200: "#f8dcdc", 300: "#f8dcdc", 400: "#f8dcdc", 600: "#a51f25", 700: "#8c1515", 800: "#751217", 900: "#5a0d11" };

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: { colors: { brand: red, teal: red, navy: red } } },
  plugins: [],
};