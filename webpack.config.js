const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src/');

const config = {
  entry: ['babel-polyfill', APP_DIR + '/main.js', APP_DIR + '/main.less'],
  output: {
    path: BUILD_DIR,
    publicPath: '/dist',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: __dirname
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: APP_DIR,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
      chunkFilename: '[id].css'
    })
  ]
};

module.exports = config;
