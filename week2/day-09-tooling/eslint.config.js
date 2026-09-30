import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const browserAndNodeGlobals = {
  console: 'readonly',
  document: 'readonly',
  window: 'readonly',
  setTimeout: 'readonly',
  process: 'readonly',
};

export default tseslint.config(
  { ignores: ['node_modules', 'dist', 'day-09-webpack'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: browserAndNodeGlobals },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
);