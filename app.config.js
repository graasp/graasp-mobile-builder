const plugins = [
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
      cameraPermission: 'Allow $(PRODUCT_NAME) to access the camera.',
    },
  ],
  [
    'expo-barcode-scanner',
    {
      cameraPermission: 'Allow $(PRODUCT_NAME) to access the camera.',
    },
  ],
  [
    '@config-plugins/detox',
    {
      skipProguard: false,
      subdomains: '*',
    },
  ],
  'expo-font',
  'expo-secure-store',
];

if (process.env.NODE_ENV === 'production') {
  plugins.push([
    '@sentry/react-native/expo',
    {
      organization: process.env.EXPO_PUBLIC_SENTRY_ORG,
      project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
    },
  ]);
}

module.exports = {
  name: 'Graasp Builder',
  slug: 'graasp-mobile-builder',
  owner: 'graasp',
  version: '1.1.9',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'graasp-mobile-builder',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#5050d2',
  },
  jsEngine: 'hermes',
  plugins,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'org.graasp.mobile',
    buildNumber: '8',
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST,
    associatedDomains: ['applinks:mobile.graasp.org'],
    infoPlist: {
      NSCameraUsageDescription:
        'Allow access to the camera to take and upload photos to Graasp. These photos can also be used to update your profile picture.',
      NSPhotoLibraryUsageDescription:
        'Allow access to photos in order to upload photos from your library to Graasp. These photos can be then used within your account on Graasp.',
    },
    config: {
      // https://docs.expo.dev/versions/latest/sdk/securestore/#ios
      usesNonExemptEncryption: false,
    },
  },
  android: {
    versionCode: 30,
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
};
