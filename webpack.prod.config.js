const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const { baseConfig } = require("./webpack.base.config");

module.exports = {
    ...baseConfig,
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        }),
        new MiniCssExtractPlugin({
            filename: "style.css",
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ["default", { discardComments: { removeAll: true } }],
                },
            }),
        ],
    },
};
