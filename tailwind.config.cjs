const { ComponentsContentPath } = require("@yext/search-ui-react");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", ComponentsContentPath],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        bangers: ["Bangers", "cursive"],
        bowlby: ["Bowlby", "cursive"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
