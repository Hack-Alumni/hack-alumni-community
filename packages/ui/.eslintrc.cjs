/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@hack-alumni/eslint-config/base'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
