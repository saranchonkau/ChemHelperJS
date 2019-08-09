function useEslintrc(webpackConfig) {
  const eslintConfig = webpackConfig.module.rules[1].use[0].options;
  eslintConfig.baseConfig = undefined;
  eslintConfig.useEslintrc = true;
  eslintConfig.ignore = true;
  eslintConfig.emitWarning = true;
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

  return webpackConfig;
};
