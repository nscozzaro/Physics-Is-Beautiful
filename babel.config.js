module.exports = {
  presets: [
    ['@babel/preset-env', {
      'targets': { 'chrome': 41 },
      'useBuiltIns': false,
      'debug': true
    }],
    '@babel/react'
  ]
}
