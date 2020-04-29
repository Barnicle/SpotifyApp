const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  devServer: {
    contentBase: './build',
    port: 3000,
    hot: true,
    open: true,
    clientLogLevel: 'silent',
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: false,
      appMountId: 'root',
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['preact', 'env'],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.resolve(__dirname, 'src/'),
              outputPath: 'img/',
              useRelativePaths: true,
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader', options: { injectType: 'singletonStyleTag' } },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
};
