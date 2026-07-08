import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  { ignores: ['dist'] },
  { files: ['**/*.js'] },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  pluginJs.configs.recommended,
];
