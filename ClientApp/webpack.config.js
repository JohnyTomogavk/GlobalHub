const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let mode = 'development';

const isDevMode = () => mode === 'development';

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
}

const optimization = {
    splitChunks: {
        cacheGroups: {
            vendors: {
                name: 'vendors',
                test: /node_modules/,
                chunks: 'all',
                enforce: true,
            },
        },
    },
    minimizer: [],
}

const plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
        filename: isDevMode ? "[name].css" : "[name].[contenthash].css",
        chunkFilename: isDevMode ? "[id].css" : "[id].[contenthash].css"
    }),
];

module.exports = {
    mode,
    optimization,
    plugins,
    entry: './src/index.tsx',
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.[contenthash].js',
        assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
        clean: true,
    },
    devServer: {
        static: './dist',
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: ['html-loader'],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
                type: mode === 'production' ? 'asset' : 'asset/resource',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts(x?)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
}
