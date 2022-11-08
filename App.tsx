import React from 'react';
import { LogBox, AppState } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, focusManager } from 'react-query';

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
      <SafeAreaProvider>
        <RootSiblingParent>
          <AppNavigator />
        </RootSiblingParent>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
