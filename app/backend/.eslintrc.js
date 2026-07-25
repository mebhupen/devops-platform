module.exports = {
  env: { node: true, commonjs: true, es2021: true, jest: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 12, sourceType: 'commonjs' },
  rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], 'no-undef': 'error', 'no-var': 'error' },
  ignorePatterns: ['node_modules/', 'coverage/', 'logs/']
};
