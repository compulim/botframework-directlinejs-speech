module.exports = {
  plugins: [
    '@babel/plugin-proposal-object-rest-spread'
  ],
  presets: [
    ['@babel/preset-env', {
      forceAllTransforms: true
    }]
  ]
};
