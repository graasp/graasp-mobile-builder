import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '../context/authContext';
import RootNavigator, { RootStackParamList } from './RootNavigator';
import { Text } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AxiosInterceptor } from '../context/axiosInterceptor';

const AppNavigator = () => {
  const config = {
    screens: {
      EmailSent: 'auth',
    },
  };

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
      'graasp://',
      'https://builder.graasp.org',
      'https://player.graasp.org',
    ],
    config,
  };
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <BottomSheetModalProvider>
        <AuthProvider>
          <AxiosInterceptor>
            <RootNavigator />
          </AxiosInterceptor>
        </AuthProvider>
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}

export default AppNavigator;
