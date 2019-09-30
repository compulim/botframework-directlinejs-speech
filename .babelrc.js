module.exports = {
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    [
      'babel-plugin-transform-inline-environment-variables', {
        include: [
          'NPM_PACKAGE_VERSION'
        ]
      }
    ]
  ],
  presets: [
    ['@babel/preset-env', {
      forceAllTransforms: true
    }]
  ],
  sourceMaps: 'inline'
};
