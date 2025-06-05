import { tailwindConfig } from '@oyster/tailwind';
const appColors = require('../../packages/ui/src/colors').Colors;

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/core/src/**/*.tsx',
    '../../packages/ui/src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        ...appColors,
        primary: appColors.CoreBlue80,
      },
    },
  },
};
