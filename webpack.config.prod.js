var config = require('./webpack.config.js');
config.entry['setup'].shift();
config.entry['note'].shift();
config.output.publicPath = './dist/';
module.exports = config;
