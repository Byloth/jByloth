const path = require("path");
const webpack = require("webpack");

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {

    devtool: "source-map",
    entry: "./src/jbyloth.js",
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ],
    output: {

        filename: "jbyloth.min.js",
        path: path.resolve(__dirname, "dist")
    }
};