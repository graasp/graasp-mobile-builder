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
