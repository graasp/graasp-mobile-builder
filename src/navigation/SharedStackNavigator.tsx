import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import DrawerHeader from '../components/common/DrawerHeader';
import { defaultScreenOptions } from '../config/constants/navigation';
import SharedScreen from '../screens/SharedScreen';

export type SharedStackParamList = {
  SharedStackShared: undefined;
};

const SharedStack = createStackNavigator<SharedStackParamList>();

const SharedStackNavigator = () => {
  return (
    <SharedStack.Navigator
      id="SharedStackNavigator"
      initialRouteName="SharedStackShared"
      screenOptions={defaultScreenOptions}
    >
      <SharedStack.Screen
        name="SharedStackShared"
        component={SharedScreen}
        options={{
          title: '',
          headerLeft: () => <DrawerHeader title="Shared Items" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
        }}
      />
    </SharedStack.Navigator>
  );
};

export default SharedStackNavigator;
