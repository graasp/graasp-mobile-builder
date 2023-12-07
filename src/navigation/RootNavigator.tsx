import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import MainStackNavigator from './MainStackNavigator';
import { RootStackParamList } from './types';

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
    </RootStack.Navigator>
  );
};

export default RootNavigator;
