const path = require("path");
const glob = require("glob");

module.exports = {
  // Path to your entry point. From this file Webpack will begin his work
  entry: ["./src/index.js", "./src/styles.css"],

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader"
        ],
        exclude: /node_modules/
      }
    ]
  }
};
