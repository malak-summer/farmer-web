import react from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'
import refresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: 'readonly', document: 'readonly', process: 'readonly', Buffer: 'readonly', fetch: 'readonly', Request: 'readonly', Response: 'readonly', AbortSignal: 'readonly', URL: 'readonly' },
    },
    plugins: { react, 'react-hooks': hooks, 'react-refresh': refresh },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-key': 'error',
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
