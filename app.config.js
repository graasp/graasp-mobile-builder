module.exports = {
  name: 'Graasp Builder',
  slug: 'graasp-mobile-builder',
  owner: 'graasp',
  version: '1.1.4',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'graasp-mobile-builder',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#5050d2',
  },
  jsEngine: 'jsc',
  plugins: [
    '@react-native-firebase/app',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          deploymentTarget: '14.0',
        },
      },
    ],
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera.',
      },
    ],
    [
      'expo-barcode-scanner',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access camera.',
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
    buildNumber: '2',
    googleServicesFile: process.env.GOOGLESERVICE_INFO_PLIST,
    associatedDomains: ['applinks:mobile.graasp.org'],
    infoPlist: {
      NSCameraUsageDescription:
        'Allow access to the camera to take and upload photos to Graasp. These photos can also be used to update your profile picture.',
      NSPhotoLibraryUsageDescription:
        'Allow access to photos in order to upload photos from your library to Graasp. These photos can be then used within your account on Graasp.',
    },
  },
  android: {
    versionCode: 17,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'org.graasp.mobile',
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'mobile.graasp.org',
            pathPrefix: '/auth',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
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
