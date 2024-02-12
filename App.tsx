import { I18nextProvider } from 'react-i18next';
import { LogBox } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
// polyfill the URL and URLParams apis
import 'react-native-url-polyfill/auto';

// polyfill for android intl
import 'intl';
import 'intl/locale-data/jsonp/en';

import i18nConfig from './src/config/i18n';
import { AuthProvider } from './src/context/AuthContext';
import { QueryClientProvider } from './src/context/QueryClientContext';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreAllLogs();

function App() {
  SplashScreen.preventAutoHideAsync();

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18nConfig}>
        <QueryClientProvider>
          <SafeAreaProvider>
            <RootSiblingParent>
              <AppNavigator />
            </RootSiblingParent>
          </SafeAreaProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </AuthProvider>
  );
}

export default App;
