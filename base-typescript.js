module.exports = {
  'parser': '@typescript-eslint/parser',
  'extends': [
    'standard',
    'plugin:@typescript-eslint/recommended',
  ],
  'plugins': ['@typescript-eslint', 'standard'],
  'parserOptions': {
    'sourceType': 'module',
  },
  'env': {
    'es6': true,
    'node': true,
  },
  'rules': {
    'generator-star-spacing': ['error', 'after'],
    'max-len': ['error', { 'code': 120 }],
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': ['error', 'never'],
    'operator-linebreak': ['error', 'before'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': ['error', { 'multiline': { 'delimiter': 'none' } }],
    '@typescript-eslint/prefer-interface': 0,
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    // already used via esling plugin, this ignores JSX usage...
    // https://github.com/typescript-eslint/typescript-eslint/issues/868
    '@typescript-eslint/no-unused-vars': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'import/named': 'warn',
  },
  'globals': {
    'describe': true,
    'test': true,
    'expect': true,
    'it': true,
    'cy': true,
    'beforeEach': true,
    'context': true,
    'jest': true,
    'fetch': true,
  },
  'settings': {
    'react': {
      'version': '16.7',
    },
  },
}
