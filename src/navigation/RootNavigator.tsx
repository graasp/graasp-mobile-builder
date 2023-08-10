import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { AUTH_PATH, PLATFORM_OS } from '../config/constants/constants';
import { useDeepLink } from '../context/DeepLinkContext';
import { useAuth } from '../context/authContext';
import SignInScreen from '../screens/SignInScreen';
import CommonStackNavigator, {
  CommonStackParamList,
} from './CommonStackNavigator';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';

export type RootStackParamList = {
  SignIn: { signUp: boolean; t?: string | undefined };
  Drawer: NavigatorScreenParams<DrawerParamList>;
  CommonStack: NavigatorScreenParams<CommonStackParamList>;
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const authContext = useAuth();
  const signInWithToken = authContext?.signIn;
  const state = authContext?.state;
  const deepLink = useDeepLink();

  const screenOptions = { headerShown: false };

  useEffect(() => {
    if (deepLink?.path === AUTH_PATH && deepLink?.queryParams?.t) {
      if (Platform.OS === PLATFORM_OS.IOS) {
        WebBrowser.dismissBrowser();
      }
      signInWithToken(deepLink.queryParams.t);
    }
  }, [deepLink]);

  return (
    <RootStack.Navigator id="RootStackNavigator" screenOptions={screenOptions}>
      {state.userToken == null ? (
        <>
          <RootStack.Screen
            name="SignIn"
            component={SignInScreen}
            initialParams={{ signUp: false }}
          />
        </>
      ) : (
        <RootStack.Screen name="Drawer" component={DrawerNavigator} />
      )}
      <RootStack.Screen name="CommonStack" component={CommonStackNavigator} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
