const { resolve } = require('path');

module.exports = {
  entry: {
    DirectLine: './lib/index'
  },
  mode: 'production',
  output: {
    filename: 'directlinespeech.js',
    libraryTarget: 'umd',
    path: resolve(__dirname, 'dist')
  }
};
