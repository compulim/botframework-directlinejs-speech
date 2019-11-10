const updateIn = require('simple-update-in');

const CONFIG = {
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

module.exports = api => {
  let config = CONFIG;

  if (api.env('test')) {
    const presetEnvOptionsPath = ['presets', ([name]) => name === '@babel/preset-env', 1];

    config = updateIn(config, [...presetEnvOptionsPath, 'forceAllTransforms']);
    config = updateIn(config, [...presetEnvOptionsPath, 'targets'], () => ({ node: 'current' }));
  }

  return config;
};
