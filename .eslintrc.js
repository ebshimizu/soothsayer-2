module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['prettier', 'standard'],
  globals: {
    __static: true,
  },
  plugins: ['html', 'prettier'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': 0,
    'standard/computed-property-even-spacing': 0,
  },
}
