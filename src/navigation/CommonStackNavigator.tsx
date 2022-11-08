import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { defaultScreenOptions } from '../config/constants/navigation';
import DetailsScreen from '../screens/DetailsScreen';
import FolderScreen from '../screens/FolderScreen';
import ItemScreen from '../screens/ItemScreen';
import { UUID } from '../types';

export type CommonStackParamList = {
  CommonStackFolder: { headerTitle: string; itemId: UUID };
  CommonStackItem: { headerTitle: string; itemId: UUID };
  CommonStackDetail: { itemId: UUID };
};

const CommonStack = createStackNavigator<CommonStackParamList>();

const CommonStackNavigator = () => {
  return (
    <CommonStack.Navigator
      id="CommonStackNavigator"
      initialRouteName="CommonStackFolder"
      screenOptions={defaultScreenOptions}
    >
      <CommonStack.Screen
        name="CommonStackFolder"
        component={FolderScreen}
        options={({
          route: {
            params: { headerTitle },
          },
        }) => ({
          title: headerTitle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <CommonStack.Screen
        name="CommonStackItem"
        component={ItemScreen}
        options={({
          route: {
            params: { headerTitle },
          },
        }) => ({
          title: headerTitle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <CommonStack.Screen
        name="CommonStackDetail"
        component={DetailsScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
      />
    </CommonStack.Navigator>
  );
};

export default CommonStackNavigator;
