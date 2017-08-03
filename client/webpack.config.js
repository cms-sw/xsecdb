var path = require('path');
var webpack = require('webpack');
require('es6-promise').polyfill();

module.exports = {
  devtool: 'source-map',
  entry: [
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
    ]
  },
  externals: {
    'Config': JSON.stringify({
      apiUrl: "/api",
      columnParameterName: 'columns'
    })
  },
};