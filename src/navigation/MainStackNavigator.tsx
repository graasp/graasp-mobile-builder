import { NavigatorScreenParams } from '@react-navigation/native';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import { defaultScreenOptions } from '../config/constants/navigation';
import QrCameraScreen from '../screens/QrCameraScreen';
import TabNavigator, { TabParamList } from './TabNavigator';

export type MainStackNavigatorParamList = {
  MainStack: NavigatorScreenParams<TabParamList>;
  QrCamera: undefined;
  ItemStack: undefined;
};

export type MainStackNavigationProp =
  StackNavigationProp<MainStackNavigatorParamList>;
const MainStack = createStackNavigator<MainStackNavigatorParamList>();

const MainStackNavigator = () => {
  const screenOptions = { headerShown: false, ...defaultScreenOptions };
  return (
    <MainStack.Navigator
      id="MainStackNavigator"
      initialRouteName="MainStack"
      screenOptions={screenOptions}
    >
      <MainStack.Screen
        name="MainStack"
        component={TabNavigator}
        options={({ route: { params } }) => ({
          title: 'Home',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <MainStack.Screen
        name="QrCamera"
        component={QrCameraScreen}
        options={({ route: { params } }) => ({
          title: 'QrCamera',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
