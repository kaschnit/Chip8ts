const { baseConfig } = require("./webpack.base.config");

module.exports = {
    ...baseConfig,
    devtool: "source-map",
	plugins: [
        new MiniCssExtractPlugin({
          filename: "style.css"
        }),
    ],
    devServer: {
        inline: true,
        port: 8080,
        hot: true,
        contentBase: PATHS.dist,
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
