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
    'expo-location',
    {
      locationWhenInUsePermission:
        'Allow $(PRODUCT_NAME) to use your location.',
      isAndroidForegroundServiceEnabled:
        'Allow $(PRODUCT_NAME) to use your location.',
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

// reuse app.json config
// we use app.json for automatic release
module.exports = ({ config }) => ({
  ...config,
  plugins,
  ios: {
    ...config.ios,
    googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST,
  },
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
  },
});
