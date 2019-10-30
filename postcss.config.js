// const purgecss = require('@fullhuman/postcss-purgecss')({
//
//   // Specify the paths to all of the template files in your project
//   content: [
//     './src/**/*.html',
//     './src/**/*.vue',
//     './src/**/*.jsx',
//     // etc.
//   ],
//
//   // Include any special characters you're using in this regular expression
//   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
// })

let environment = {
  mode: "development",
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-import"),
    require("postcss-flexbugs-fixes"),
    require("postcss-preset-env")({
      autoprefixer: {
        flexbox: "no-2009"
      },
      stage: 3
    }),
    require("@fullhuman/postcss-purgecss")({
      content: [
        "./src/index.html",
        "./src/templates/cognus-card.html",
        "./src/templates/cognus-description.html",
        "./src/templates/cognus-hr.html",
        "./src/templates/cognus-li.html",
        "./src/templates/simplebar.html"
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
};

module.exports = environment;
