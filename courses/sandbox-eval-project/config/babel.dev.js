module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  // It enables caching results in OS temporary directory for faster rebuilds.
  cacheDirectory: true,
  cacheCompression: false,
  compact: false,
  presets: [
    // Latest stable ECMAScript features
    require.resolve('@babel/preset-flow'),
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          chrome: 70,
          // We currently minify with uglify
          // Remove after https://github.com/mishoo/UglifyJS2/issues/448
        },
        // Disable polyfill transforms
        useBuiltIns: false,
        modules: false,
        forceAllTransforms: !process.env.LOCAL_DEV,
      },
    ],
    // JSX, Flow
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react'),
  ].filter(Boolean),
  plugins: [
    require.resolve('@babel/plugin-transform-template-literals'),
    require.resolve('@babel/plugin-transform-destructuring'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('babel-plugin-lodash'),
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-styled-components'),
    require.resolve('babel-plugin-macros'),
    require.resolve('babel-plugin-graphql-tag'),
    require.resolve('@babel/plugin-transform-react-display-name'),
  ],
};
