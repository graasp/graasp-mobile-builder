import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { LogBox, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, focusManager } from 'react-query';

import i18nConfig from './src/config/i18n';
import queryClient from './src/config/queryClient';
import AppNavigator from './src/navigation/AppNavigator';

focusManager.setEventListener(() => {
  const handleAppStateChange = (appState: any) => {
    console.log('AppState: ', appState);
    focusManager.setFocused(appState === 'active');
  };

  const appState = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    appState.remove();
  };
});

LogBox.ignoreAllLogs();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nConfig}>
        <SafeAreaProvider>
          <RootSiblingParent>
            <AppNavigator />
          </RootSiblingParent>
        </SafeAreaProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
