const bytes = require("bytes");
const del = require("del").sync;

module.exports = (eleventyConfig) => {
  del("www");

  eleventyConfig.addFilter("bytes", n => bytes(n));

  return {
    dir: {
      input: "src",
      output: "www"
    },
  };
};
