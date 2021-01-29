const bytes = require("bytes");
const del = require("del").sync;

module.exports = (eleventyConfig) => {
  del("www");

  eleventyConfig.addFilter("bytes", n => bytes(n));
  eleventyConfig.addShortcode("now", (d = Date.now()) => {
    d = new Date(d);
    return `<time datetime="${d.toISOString()}">${d.toLocaleDateString()} ${d.toLocaleTimeString()}</time>`;
  });

  return {
    dir: {
      input: "src",
      output: "www"
    },
  };
};
