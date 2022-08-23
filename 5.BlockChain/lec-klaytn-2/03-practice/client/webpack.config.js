const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

module.exports = {
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.bundle.js',
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    // open: true, // browser auto open
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3000",
    //     pathRewrite: { "^/api": "" },
    //   },
    // },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEPLOYED_ADDRESS: JSON.stringify(
        fs
          .readFileSync('./public/YouTubeThumbnailToken_Address', 'utf8')
          .replace(/\n|\r/g, ''),
      ),
      DEPLOYED_ABI:
        fs.existsSync('./public/YouTubeThumbnailToken_ABI') &&
        fs.readFileSync('./public/YouTubeThumbnailToken_ABI', 'utf8'),

      DEPLOYED_ADDRESS_TOKENSALES: JSON.stringify(
        fs
          .readFileSync('./public/TokenSales_Address', 'utf8')
          .replace(/\n|\r/g, ''),
      ),
      DEPLOYED_ABI_TOKENSALES:
        fs.existsSync('./public/TokenSales_ABI') &&
        fs.readFileSync('./public/TokenSales_ABI', 'utf8'),
    }),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      url: require.resolve('url'),
      stream: require.resolve('stream-browserify'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      fs:false
    },
  }
};
