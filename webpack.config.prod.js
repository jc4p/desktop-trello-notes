var config = require('./webpack.config.dev.js');
config.entry['setup'].shift();
config.entry['note'].shift();
config.plugins.shift();
config.plugins.shift();
config.output.publicPath = './dist/';
module.exports = config;