module.exports = {
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: "Roboto",
        klavika: "Klavika",
      },
      colors: {
        "facebook-blue": "#1876f2",
      },
    },
  },
  plugins: [],
};
