import { NavigatorScreenParams } from '@react-navigation/native';
import {
  StackScreenProps,
  createStackNavigator,
} from '@react-navigation/stack';

import SignInScreen from '../screens/SignInScreen';
import CommonStackNavigator, {
  CommonStackParamList,
} from './CommonStackNavigator';
import MainStackNavigator, {
  MainStackNavigatorParamList,
} from './MainStackNavigator';

export type RootStackParamList = {
  SignIn: { signUp: boolean; t?: string | undefined };
  Main: NavigatorScreenParams<MainStackNavigatorParamList>;
  CommonStack: NavigatorScreenParams<CommonStackParamList>;
};

type CommonStackProps = StackScreenProps<RootStackParamList>;
export type RootNavigationProp = CommonStackProps['navigation'];

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
