module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': ['error', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'object-curly-spacing': ['error', 'never'],
    'vue/html-closing-bracket-spacing': ['error', {startTag: 'never', endTag: 'never', selfClosingTag: 'never'}],
    'vue/mustache-interpolation-spacing': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', {multiline: {delimiter: 'none', requireLast: false}, singleline: {delimiter: 'comma', requireLast: false}}],
  }
}
