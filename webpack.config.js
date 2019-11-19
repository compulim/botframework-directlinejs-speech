const { resolve } = require('path');

module.exports = {
  entry: './lib/index',
  mode: 'production',
  output: {
    filename: 'directlinespeech.production.min.js',
    library: 'DirectLineSpeech',
    libraryTarget: 'window',
    path: resolve(__dirname, 'dist')
  }
};
