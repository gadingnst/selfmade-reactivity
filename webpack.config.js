const Path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const publicPath = require('./config.json').basePath

module.exports = {
  entry: './src/index.js',

  output: {
    publicPath,
    path: Path.join(__dirname, '/build'),
    filename: '[name]-[hash].js',
    chunkFilename: '[id].[hash].bundle.js'
  },

  devServer: {
    publicPath,
    historyApiFallback: {
      index: publicPath
    }
  },

  resolve: {
    modules: ['node_modules']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    })
  ]
}