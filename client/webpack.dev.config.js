var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const { CONNECT } = require("./config");

module.exports = (env) => {
  let tst = path.resolve(__dirname, "src/components/");
  console.log("@@@@@@@@", CONNECT);
  return {
    mode: "development",
    entry: "./src/index.jsx",
    resolve: {
      extensions: [".js", ".jsx"],
      //alias: {
      //  "@components": path.resolve(__dirname, "src/components/"),
      //},
    },
    devServer: {
      hot: false,
      inline: false,
      liveReload: false,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.jsx?$/,
          use: "babel-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {},
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./src/index.html", inject: false }),
      new webpack.DefinePlugin({
        "process.env.CONNECT": JSON.stringify(CONNECT), //`"http://127.0.0.1:3001"`,
      }),
    ],
  };
};
