let environment = {
  mode: "development",
  plugins: [
    require("tailwindcss")("./tailwind.config.js"),
    require("autoprefixer"),
    require("postcss-import"),
    require("postcss-flexbugs-fixes"),
    require("postcss-scrollbar"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009"
      },
      stage: 3
    }),
    require("cssnano")({
      preset: "default"
    }),
    require("@fullhuman/postcss-purgecss")({
      content: [
        "./index.html",
        "./src/templates/cognus-card.html",
        "./src/templates/cognus-description.html",
        "./src/templates/cognus-hr.html",
        "./src/templates/cognus-li.html",
        "./src/templates/simplebar.html",
        "**/*.html",
        "./src/index.js"
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};

module.exports = environment;
