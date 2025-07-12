module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@features': './src/features',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@styles': './src/styles',
          '@service': './src/service',
          '@state': './src/state',
          '@utils': './src/utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // ✅ required
      },
    ],
    'react-native-reanimated/plugin' // ✅ MUST be last
  ],
};
