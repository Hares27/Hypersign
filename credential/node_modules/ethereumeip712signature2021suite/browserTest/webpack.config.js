const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    entry: {
        main: "./src/main.js",
    },
    mode:"development",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname,  "dist")
    },
    devServer: {
        port: 8081
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            chunks: ["main"]
        }),
        new NodePolyfillPlugin()
       
      
    ],
    resolve: {
        fallback: {
          "tls": false,
          "net": false,
          "fs": false,
        }
      }
};