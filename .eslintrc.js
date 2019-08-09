module.exports = {
  extends: ['react-app', 'prettier', 'prettier/react'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    // There is no need to use alternatives everywhere like shape.
    // Sometimes we just need to know that this is an array in container for example.
    // We does not do any manipulations with array props and just pass it into the component.
    'react/forbid-prop-types': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'import/prefer-default-export': 'off',
  },
};
