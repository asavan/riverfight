import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";

function getLocalExternalIP(defaultAddr) {
    let cand = Object.values(os.networkInterfaces())
        .flat()
        .filter(a => a.family === "IPv4" && !a.internal);
    if (cand.length > 1) {
        cand = cand.filter(a => a.netmask === "255.255.255.0")
    }
    if (cand.length === 0) {
        return defaultAddr;
    }
    cand = cand.map(a => a.address);
    console.log(cand);
    return cand.slice(-1)[0];
}

const devConfig = () => {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    console.log(getLocalExternalIP("0.0.0.0"));
    const addr = "0.0.0.0";
    return {
        entry: {main: ["./src/index.js", "./src/css/style.css"]},
        mode: "development",
        output: {
            path: path.resolve(dirname, "../docs"),
            filename: "[name].js",
            clean: true
        },
        // publicPath: "./",
        cache: false,
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
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                minify: false,
                scriptLoading: "module"
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css"
            }),
            new webpack.DefinePlugin({
                __USE_SERVICE_WORKERS__: false
            }),
            new CopyPlugin({
                patterns: [
                    { from: "./assets", to: "./assets" },
                    { from: "./src/manifest.json", to: "./" },
                    { from: "./src/app.webmanifest", to: "./" }
                ],
            })
        ],
        devServer: {
            compress: true,
            port: 8080,
            hot: true,
            open: true,
            host: addr
        }
    };
};

export default devConfig;
