const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const os = require('os');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
const {GenerateSW} = require('workbox-webpack-plugin');


module.exports = (env, argv) => {
    const devMode = (argv.mode !== 'production');
    const ifaces = os.networkInterfaces();
    let addr = '0.0.0.0';
    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
                addr = iface.address;
            }
            ++alias;
        });
    });
    return {

        entry: {main: "./src/index.js"},
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: devMode ? "[name].js" : "[name].[contenthash].js",
            publicPath: devMode ? "/" : "./dist/"
            // publicPath: "./dist/"
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            // publicPath: '../',
                            hmr: devMode,
                        },
                    }, 'css-loader'],
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
                minify: false,
                filename: devMode ? "./index.html" : "../index.html",
                __USE_SERVICE_WORKERS__ : !devMode
                // filename: 'index.html'
            }),
            // new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[contenthash].css'
            }),
            ...(devMode ? [] : [new GenerateSW({
                swDest: '../sw.js',
                // these options encourage the ServiceWorkers to get in there fast
                // and not allow any straggling "old" SWs to hang around
                clientsClaim: true,
                skipWaiting: true,
            })]),
            new webpack.DefinePlugin({
                __USE_SERVICE_WORKERS__: !devMode
            })
        ],
        devServer: {
            // contentBase: path.resolve(__dirname, "src"),
            historyApiFallback: true,
            compress: true,
            port: 8080,
            hot: true,
            open: true,
            host: addr,
            // clientLogLevel: 'debug',
            // watchContentBase: true,
        }
    }
};
