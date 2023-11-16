import { NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import CommonStackNavigator from './CommonStackNavigator';
import MainStackNavigator from './MainStackNavigator';

export type RootStackParamList = {
  SignIn: any;
  Main: undefined;
  CommonStack: undefined;
};

export type RootNavigationProp = NavigationProp<RootStackParamList>;

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const screenOptions = { headerShown: false };

  return (
    <RootStack.Navigator id="RootNavigator" screenOptions={screenOptions}>
      <RootStack.Screen
        name="SignIn"
        component={SignInScreen}
        initialParams={{ signUp: false }}
      />
      <RootStack.Screen name="Main" component={MainStackNavigator} />
      <RootStack.Screen name="CommonStack" component={CommonStackNavigator} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
