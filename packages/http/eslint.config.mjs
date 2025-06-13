import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        settings: {},
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
    {
        name: 'prettier',
        rules: prettier.rules,
    },
];
