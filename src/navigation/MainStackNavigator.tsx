import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from '../config/constants/navigation';
import QrCameraScreen from '../screens/QrCameraScreen';
import ItemStackNavigator from './ItemStackNavigator';
import TabNavigator from './TabNavigator';
import {
  ITEM_NAVIGATOR,
  MAIN_NAVIGATOR,
  MAIN_NAVIGATOR_MAIN,
  MAIN_NAVIGATOR_QR_CAMERA,
} from './names';
import { MainStackParamList } from './types';

const MainStack = createStackNavigator<MainStackParamList>();

const MainStackNavigator = () => {
  const screenOptions = { headerShown: false, ...defaultScreenOptions };
  return (
    <MainStack.Navigator
      id={MAIN_NAVIGATOR}
      initialRouteName={MAIN_NAVIGATOR_MAIN}
      screenOptions={screenOptions}
    >
      <MainStack.Screen
        name={MAIN_NAVIGATOR_MAIN}
        component={TabNavigator}
        options={({ route: { params } }) => ({
          title: 'Home',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <MainStack.Screen
        name={MAIN_NAVIGATOR_QR_CAMERA}
        component={QrCameraScreen}
        options={({ route: { params } }) => ({
          title: 'QrCamera',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <MainStack.Screen name={ITEM_NAVIGATOR} component={ItemStackNavigator} />
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
