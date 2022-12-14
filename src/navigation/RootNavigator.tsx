import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { useAuth } from '../context/authContext';
import EmailSentScreen from '../screens/EmailSentScreen';
import SignInScreen from '../screens/SignInScreen';
import CommonStackNavigator, {
  CommonStackParamList,
} from './CommonStackNavigator';
import DrawerNavigator, { DrawerParamList } from './DrawerNavigator';

export type RootStackParamList = {
  SignIn: { signUp: boolean };
  Drawer: NavigatorScreenParams<DrawerParamList>;
  EmailSent: { t?: string | undefined };
  CommonStack: NavigatorScreenParams<CommonStackParamList>;
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const authContext = useAuth();
  const state = authContext?.state;

  const screenOptions = { headerShown: false };

  return (
    <RootStack.Navigator id="RootStackNavigator" screenOptions={screenOptions}>
      {state.userToken == null ? (
        <>
          <RootStack.Screen
            name="SignIn"
            component={SignInScreen}
            initialParams={{ signUp: false }}
          />
          <RootStack.Screen name="EmailSent" component={EmailSentScreen} />
        </>
      ) : (
        <RootStack.Screen name="Drawer" component={DrawerNavigator} />
      )}
      <RootStack.Screen name="CommonStack" component={CommonStackNavigator} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
