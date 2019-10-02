const { resolve } = require('path');

module.exports = {
  entry: './lib/index',
  mode: 'production',
  output: {
    filename: 'directlinespeech.js',
    library: 'DirectLine',
    // libraryExport: 'DirectLine',
    libraryTarget: 'window',
    path: resolve(__dirname, 'dist')
  }
};
