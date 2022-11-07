import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import React from 'react';
import { defaultScreenOptions } from '../config/constants/navigation';
import DrawerHeader from '../components/common/DrawerHeader';

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
}

export default StackNavigator;
