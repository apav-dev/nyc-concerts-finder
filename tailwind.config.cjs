const { ComponentsContentPath } = require("@yext/search-ui-react");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", ComponentsContentPath],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
