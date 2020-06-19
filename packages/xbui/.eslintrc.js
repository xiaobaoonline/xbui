module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: ['plugin:vue/recommended', '@vue/prettier'],
  ignorePatterns: ['node_modules/*', 'dist/*'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': 'off',
    semi: ['error', 'always'],
    'vue/require-default-prop': 'off',
    'vue/no-unused-vars': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'no-irregular-whitespace': ['error', { skipComments: true }],
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
      },
    ],
    'no-empty': 0,
    'comma-dangle': [2, 'always-multiline'],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
