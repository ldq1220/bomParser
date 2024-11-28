import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.min.js', 'coverage/**']
  },
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue', '**/*.ts'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      // Vue 特定规则
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-indent': ['error', 2],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always'
          }
        }
      ],
      'vue/no-multiple-template-root': 'off',
      'vue/no-explicit-any': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'off',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ]
    }
  }
]
