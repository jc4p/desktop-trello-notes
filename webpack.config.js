var webpack = require('webpack');
var path = require('path');

module.exports = {
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
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:9000/dist/',
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: [ { loader: "babel-loader" } ] },
      { test: /\.css$/, use: [ { loader: 'style-loader'}, { 'loader': 'css-loader?sourceMap&modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' } ] },
      { test: /\.scss$/, use: [ { loader: 'style-loader'}, { 'loader': 'css-loader', options: { sourceMap: true, modules: true, camelCase: 'dashes', importLoaders: 1, localIdentName: '[name]__[local]___[hash:base64:5]' } },
                                { loader: 'sass-loader', options: { includePaths: [ path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, './vendor/milligram/src') ] } } ] }
    ]
  },
  resolve: {
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        drop_console: false
      }
    })
  ],
  devtool: 'cheap-module-eval-source-map',
  target: 'electron-renderer'
};