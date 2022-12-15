module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  extends: [
    'eslint:recommended',
    'airbnb-base'
  ],
  env: {
    es2020: true,
    node: true
  },
  rules: {
    'comma-dangle': ['warn', 'never'],
    'max-len': 'off',
    'no-await-in-loop': 'off'
  }
};
