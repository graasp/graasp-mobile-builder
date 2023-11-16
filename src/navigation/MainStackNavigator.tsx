import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from '../config/constants/navigation';
import TabNavigator, { TabParamList } from './TabNavigator';

export type MainStackNavigatorParamList = {
  MainStack: NavigatorScreenParams<TabParamList>;
};

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
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
