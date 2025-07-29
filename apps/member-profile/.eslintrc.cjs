/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@hack/eslint-config/base'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-restricted-imports': ['error', { patterns: ['./*', '../*'] }],
  },
};
