const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

// Additional source extensions
const additionalSourceExts = ['cjs'];
// Additional asset plugins
const additionalAssetPlugins = ['expo-asset/tools/hashAssetFiles'];

if (process.env.RN_SRC_EXT) {
  additionalSourceExts.push(...process.env.RN_SRC_EXT.split(','));
}

if (process.env.EXPO_PUBLIC_DETOX_MOCKED === 'true') {
  additionalSourceExts.push('mock.tsx');
}

// Add additional source extensions
config.resolver.sourceExts.push(...additionalSourceExts);
// Add additional asset plugins
config.transformer.assetPlugins.push(...additionalAssetPlugins);

module.exports = config;
