const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = {
  /* general options */

  resolver: {
    ...config.resolver,
    sourceExts: [
      'cjs',
      // useful for mocking the camera
      process.env.RN_SRC_EXT && process.env.RN_SRC_EXT.split(','),
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
