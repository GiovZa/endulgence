const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  context: path.join(__dirname, "src"),
  entry: {
    main: "./index.js",      // for index.html
    shop: "./js/shop.js",    // for shop.html  <-- points to src/js/shop.js
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    host: "localhost",
    open: true,
    static: { directory: path.resolve(__dirname, "dist") },
    watchFiles: ["src/**/*"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "./assets/", to: "./assets/" }],
    }),
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      chunks: ["main"],      // injects main.js
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: "shop.html",
      filename: "shop.html",
      chunks: ["shop"],      // injects shop.js
      inject: "body",
    }),
  ],
  module: {
    rules: [
      { test: /\.(js|jsx)$/i, loader: "babel-loader" },
      { test: /\.s[ac]ss$/i, use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"] },
      { test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i, type: "asset" },
      { test: /\.html$/i, loader: "html-loader" },
    ],
  },
};
