const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = {
    build: path.resolve(__dirname, "build")
};

const baseConfig = {
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: paths.build,
        publicPath: "/"
    },
    module: {
        rules: [
            {	// typescript and javascript with or witthout JSX
                test: /\.(t|j)sx?$/,
                use: ["ts-loader"],
                exclude: /node_modules/
            },
            {	// sass
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS
                ]
            },
            {	// css
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // translates CSS into CommonJS
                ]
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                use: ["url-loader"]
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
};

module.exports = {
    paths,
    baseConfig
};