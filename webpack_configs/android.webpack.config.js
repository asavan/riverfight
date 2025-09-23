import path from "path";
import { fileURLToPath } from "url";

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserJSPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

import webpack from "webpack";

export default function aConfig() {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return {

        entry: {main: ["./src/index.js", "./src/css/style.css"]},
        output: {
            path: path.resolve(dirname, "../android"),
            filename: "[name].[contenthash].js",
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [{
                        loader: MiniCssExtractPlugin.loader
                    }, "css-loader"],
                }
            ]
        },
        optimization: {
            minimizer: [new TerserJSPlugin({
                terserOptions: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                }
            }), new CssMinimizerPlugin()],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                minify: false
            }),
            new MiniCssExtractPlugin({
                filename: "[name].[contenthash].css"
            }),
            new webpack.DefinePlugin({
                __USE_SERVICE_WORKERS__: false
            }),
            new CopyPlugin({
                patterns: [
                    { from: "./assets", to: "./assets" },
                    { from: "./src/app.webmanifest", to: "./" },
                    { from: "./.well-known", to: "./well-known" }
                ],
            })
        ]
    };
}
