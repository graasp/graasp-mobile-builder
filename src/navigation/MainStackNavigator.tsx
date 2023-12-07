import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from '../config/constants/navigation';
import QrCameraScreen from '../screens/QrCameraScreen';
import ItemStackNavigator from './ItemStackNavigator';
import TabNavigator from './TabNavigator';
import { MainStackParamList } from './types';

const MainStack = createStackNavigator<MainStackParamList>();

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
      <MainStack.Screen name="ItemStack" component={ItemStackNavigator} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
