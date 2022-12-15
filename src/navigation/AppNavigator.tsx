import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';

import { AuthProvider } from '../context/authContext';
import { AxiosInterceptor } from '../context/axiosInterceptor';
import { CurrentMemberProvider } from '../context/CurrentMemberContext';
import RootNavigator, { RootStackParamList } from './RootNavigator';

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
            <CurrentMemberProvider>
              <RootNavigator />
            </CurrentMemberProvider>
          </AxiosInterceptor>
        </AuthProvider>
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
