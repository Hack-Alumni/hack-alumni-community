/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@hackcommunity/eslint-config/base'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-constant-condition': ['error', { checkLoops: false }],
  },
};
