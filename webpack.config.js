const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { baseConfig, paths } = require("./webpack.base.config");

module.exports = {
    ...baseConfig,
    devtool: "source-map",
    mode: "development",
	plugins: [
        new MiniCssExtractPlugin({
          filename: "style.css"
        }),
    ],
    devServer: {
        inline: true,
        port: 8080,
        hot: true,
        contentBase: paths.build,
        historyApiFallback: {
            rewrites: [
                {
                    from: /\./,
                    to: "/",
                },
            ],
        },
    },
};
