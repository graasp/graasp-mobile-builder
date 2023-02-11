import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { CurrentMemberProvider } from '../context/CurrentMemberContext';
import { ViewProvider } from '../context/ViewContext';
import { AuthProvider } from '../context/authContext';
import { AxiosInterceptor } from '../context/axiosInterceptor';
import RootNavigator, { RootStackParamList } from './RootNavigator';

const AppNavigator = () => {
  const config = {
    screens: {
      EmailSent: 'auth',
    },
  };

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
      'graasp-mobile-builder://',
      'https://builder.graasp.org',
      'https://player.graasp.org',
    ],
    config,
  };
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <AuthProvider>
        <AxiosInterceptor>
          <CurrentMemberProvider>
            <ViewProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <RootNavigator />
                  <Toast />
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </ViewProvider>
          </CurrentMemberProvider>
        </AxiosInterceptor>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
