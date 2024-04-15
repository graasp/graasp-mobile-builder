import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import MainStackNavigator from './MainStackNavigator';
import {
  ROOT_NAVIGATOR,
  ROOT_NAVIGATOR_MAIN,
  ROOT_NAVIGATOR_SIGN_IN,
} from './names';
import { RootStackParamList } from './types';

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const screenOptions = { headerShown: false };

  useEffect(() => {
    // Hide splash screen once RootNavigator is loaded
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplashScreen().catch((error) => console.log(error));
  }, []);

  return (
    <RootStack.Navigator id={ROOT_NAVIGATOR} screenOptions={screenOptions}>
      <RootStack.Screen
        name={ROOT_NAVIGATOR_SIGN_IN}
        component={SignInScreen}
        initialParams={{ signUp: false }}
      />
      <RootStack.Screen
        name={ROOT_NAVIGATOR_MAIN}
        component={MainStackNavigator}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
