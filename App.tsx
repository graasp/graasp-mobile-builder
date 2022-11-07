import React from 'react';
import { LogBox, AppState } from 'react-native';
import { QueryClientProvider, focusManager } from 'react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import queryClient from './src/config/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import { RootSiblingParent } from 'react-native-root-siblings';

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