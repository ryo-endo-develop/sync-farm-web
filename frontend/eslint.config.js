import js from '@eslint/js'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import redosPlugin from 'eslint-plugin-redos'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      redos: redosPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.es2020
      }
    },
    rules: {
      ...tsPlugin.configs['recommended-type-checked'].rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'redos/no-vulnerable': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn' // 追加：anyの割り当てに関する警告を軽減
    }
  },
  // Jestテストファイル用の設定を追加
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/jest.setup.ts'],
    languageOptions: {
      globals: {
        ...globals.jest // Jestのグローバル変数を追加
      }
    }
  },
  {
    // 無視設定
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.*',
      '.secretlintrc.json',
      '.prettierrc.json',
      'src/vite-env.d.ts',
      'src/generated/**'
    ]
  }
]
