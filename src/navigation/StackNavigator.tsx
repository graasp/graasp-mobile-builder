import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DrawerHeader from '../components/common/DrawerHeader';
import { defaultScreenOptions } from '../config/constants/navigation';
import HomeScreen from '../screens/HomeScreen';

export type StackParamList = {
  HomeStack: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      id="StackNavigator"
      initialRouteName="HomeStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{
          title: '',
          headerLeft: () => <DrawerHeader title="Home" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
