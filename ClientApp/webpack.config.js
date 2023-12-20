const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
let mode = 'development';

const isDevMode = () => mode === 'development';
const isProductionMode = () => process.env.NODE_ENV === 'production';

if (isProductionMode()) {
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
};

const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'public/index.html',
    favicon: 'public/favicon.svg',
  }),
  new MiniCssExtractPlugin({
    filename: isDevMode() ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: isDevMode() ? '[id].css' : '[id].[contenthash].css',
  }),
  new Dotenv(),
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
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[contenthash].js',
    assetModuleFilename: '[name][ext]',
    clean: true,
  },
  devServer: {
    static: './dist',
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },
  stats: {
    errorDetails: true,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                mode: 'local',
                auto: true,
                localIdentName: isDevMode()
                  ? '[name]__[local]--[hash:base64:5]'
                  : '[hash:base64]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: isProductionMode() ? 'asset' : 'asset/resource',
      },
    ],
  },
};
