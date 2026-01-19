// eslint.config.ts
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
// import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  { ignores: ['dist', 'src/graphql/graphql.ts', '.nitro', '.output', '.tanstack'] },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      import: eslintPluginImport,
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],
      'import/no-unresolved': 'off',
      'import/no-relative-parent-imports': 'error',
      'import/no-relative-packages': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,
  prettier
])
