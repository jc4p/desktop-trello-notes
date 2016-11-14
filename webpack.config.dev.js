var webpack = require('webpack');
var path = require('path');
var webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var config = {
  entry: {
    setup: [
      'webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr',
      './app/setup'
    ],
    note: [
      'webpack-hot-middleware/client?reload=true&path=http://localhost:9000/__webpack_hmr',
      './app/note'
    ],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      loade: 'style!css-loader?sourceMap&modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
      exclude: /.*react-spinkit.*/
    },
    {
      test: /app\/src.*\.scss$/,
      loader: 'style!css-loader?sourceMap&modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass',
    },
    { test: /react-spinkit.*css$/,
      loader: 'style!css-loader?sourceMap&importLoaders=1'
    },
    {
      test: /\.png|\.svg$/,
      loaders: ['file-loader']
    },
    { test: /\.json$/,
      loaders: ['json-loader']
    }]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: 'http://localhost:9000/dist/',
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
  },
  sassLoader: {
    includePaths: [ path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, './vendor/milligram/src') ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

config.target = webpackTargetElectronRenderer(config);

module.exports = config;