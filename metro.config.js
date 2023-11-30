const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const mockSourceExt =
  process.env.EXPO_PUBLIC_DETOX_MOCKED === 'true' ? ['mock.tsx'] : [];

module.exports = {
  /* general options */

  resolver: {
    ...config.resolver,
    sourceExts: [
      'cjs',
      // useful for mocking the camera
      process.env.RN_SRC_EXT && process.env.RN_SRC_EXT.split(','),
      ...mockSourceExt,
      ...config.resolver.sourceExts,
    ],
  },
  transformer: {
    /* transformer options */
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  serializer: {
    /* serializer options */
  },
  server: {
    /* server options */
  },
  watcher: {
    /* watcher options */
    watchman: {
      /* Watchman-specific options */
    },
  },
};
