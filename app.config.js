module.exports = {
  name: 'Graasp Builder',
  slug: 'graasp-mobile-builder',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'graasp-mobile-builder',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#5050d2',
  },
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'org.graasp.mobile',
    buildNumber: '1',
    googleServicesFile: process.env.GOOGLESERVICE_INFO_PLIST,
    infoPlist: {
      NSCameraUsageDescription:
        'Allow access to the camera to take and upload photos from it.',
      NSPhotoLibraryUsageDescription:
        'Allow access to photos to upload photos from your library.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'org.graasp.mobile',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    eas: {
      projectId: '705d0d2e-daf9-40d0-8d2b-10c26d48ab5a',
    },
  },
};
