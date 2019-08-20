const path = require('path');
const fs = require('fs');
const util = require('util');

function useEslintrc(webpackConfig) {
  const eslintConfig = webpackConfig.module.rules[1].use[0].options;
  eslintConfig.baseConfig = undefined;
  eslintConfig.useEslintrc = true;
  eslintConfig.ignore = true;
  eslintConfig.emitWarning = true;
}

function changeBuildDirectory(webpackConfig) {
  const appDirectory = fs.realpathSync(process.cwd());
  const buildPath = path.resolve(appDirectory, 'electron', 'client');

  console.log('Build path: ', util.inspect(buildPath, { colors: 'green' }));

  webpackConfig.output.path = buildPath;
}

/**
 * Function to override webpack config
 *
 * @param {Object} webpackConfig - webpack config
 * @param {Object} options
 * @param {Object} options.webpack - webpack instance
 * @param {Object} options.paths - object of paths
 * @param {String} options.webpackEnv - "development" or "production"
 */
module.exports = function(webpackConfig, options) {
  if (options.webpackEnv === 'development') {
    useEslintrc(webpackConfig);
  }

  // if (options.webpackEnv === 'production') {
  //   changeBuildDirectory(webpackConfig);
  // }

  return webpackConfig;
};
