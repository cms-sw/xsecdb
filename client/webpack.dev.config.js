var path = require('path');
var webpack = require('webpack');
require('es6-promise').polyfill()

var HtmlWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/public/index.html',
  hash: true,
  filename: 'index.html',
  inject: 'body'
});

var HotReloader = new webpack.HotModuleReplacementPlugin();

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://188.185.74.109:8080',
    'webpack/hot/dev-server',
    './src/index.jsx'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    noParse: [/jszip.js$/],
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'react-hot!babel',
        include: path.join(__dirname, 'src')
      },
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        },
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
    ]
  },
  externals: {
    'Config': JSON.stringify({
      apiUrl: "http://188.185.74.109:4241/api"
    })
  },
  plugins: [HTMLWebpackPluginConfig, HotReloader],
  devServer: {
    contentBase: __dirname + '/dist',
    hot: true,
    historyApiFallback: true
  }
};