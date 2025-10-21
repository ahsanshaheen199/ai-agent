// @ts-check

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { globalIgnores, defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx,js,mjs,cjs}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			eslintPluginPrettierRecommended,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},
]);
