/**
 * Function to override paths
 *
 * @param {Object} paths - object contains paths for webpack and other scripts
 * @param {Object} options
 * @param {Function} options.resolveApp - function, which resolve path relative to app directory
 */
function overridePaths(paths, options) {
  paths.appBuild = options.resolveApp('electron/client');
  return paths;
}

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
function overrideWebpackConfig(webpackConfig, options) {
  if (options.webpackEnv === 'development') {
    useEslintrc(webpackConfig);
  }

  return webpackConfig;
}

/**
 * Function to override Webpack Dev Server config
 *
 * @param {Object} webpackDevServerConfig - webpack dev server config
 * @param {Object} options
 * @param {Object|Function} options.proxy - proxy config ( https://webpack.js.org/configuration/dev-server/#devserver-proxy )
 * @param {Object} options.allowedHost - public url of dev server ( https://webpack.js.org/configuration/dev-server/#devserver-public )
 */
function overrideWebpackDevServerConfig(webpackDevServerConfig, options) {
  return webpackDevServerConfig;
}

module.exports = {
  overridePaths,
  overrideWebpackConfig,
  overrideWebpackDevServerConfig,
};
