import { tailwindConfig } from '@oyster/tailwind';
import { Colors } from '../../packages/ui/src/colors';

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
        ...Colors,
        primary: Colors.CoreBlue80,
      },
    },
  },
};
