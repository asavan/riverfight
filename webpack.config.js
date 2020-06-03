const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = (env, argv) => {
    const devMode = (argv.mode !== 'production');
    return {

        entry: {main: "./src/index.js"},
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].[contenthash].js",
            // publicPath: "../"
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                }
            ]
        },
        optimization: {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new WebpackMd5Hash(),
            new HtmlWebpackPlugin({
                favicon: "./assets/boat7.svg",
                // inject: false,
                template: "./src/index.html",
                // template: require("html-webpack-template"),
                // hash: true,
                filename: devMode ? "./index.html" : "../index.html"
                // filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[contenthash].css'
            })
        ],
        devServer: {
            contentBase: path.resolve(__dirname, "dist"),
            historyApiFallback: true,
            compress: true,
            port: 8080,
            // hot: true,
            open: true,
            // clientLogLevel: 'debug',
            watchContentBase: true,
        }
    }
};
