module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    'eslint:recommended',
    'standard'
  ],
  rules: {
    'camelcase': [0, {
      'properties': 'always'
    }],
	'no-mixed-spaces-and-tabs':0, //朋修改
    'vue/no-dupe-keys': 'off',
    'no-prototype-builtins': 'off',
    'no-dupe-keys': 'off',
    'prefer-promise-reject-errors': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'object-curly-spacing': 'off',
    'vue/no-parsing-error': 'off',
    'vue/no-v-html': 'off',
    'vue/order-in-components': 'off',
    'vue/return-in-computed-property': 'off',
    'no-unused-vars': 'off',
    'no-tabs': 'off',
    'eqeqeq': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'prefer-const': 'off',
    'vue/html-self-closing': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'no-undef': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    'vue/attributes-order': 'off',
    'eol-last': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}