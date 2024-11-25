module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config*'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { 
    react: { version: '18.2' },
    'import/resolver': {
      alias: {
        map: [
          ['@common', './src/common'],
          ['@features', './src/features'],
          ['@utils', './src/utils']
        ],
        extensions: ['.js', '.jsx', '.json']
      }
    }
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/prop-types': 0,
    'no-unused-vars': ['error'],
    'no-console': ['error', { allow: ['warn', 'debug'] }],
  },
  overrides: [
    {
      files: ['**/common/utils.jsx', '**/common/router.jsx'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
    {
      files: ['**/*.jsx'],
      rules: {
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
};