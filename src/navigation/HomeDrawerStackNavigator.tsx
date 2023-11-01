import React from 'react';

import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultScreenOptions } from '../config/constants/navigation';
import TabNavigator, { TabParamList } from './TabNavigator';

export type HomeDrawerParamList = {
  StackHomeStack: NavigatorScreenParams<TabParamList>;
};

const HomeDrawerStack = createStackNavigator<HomeDrawerParamList>();

const HomeDrawerStackNavigator = () => {
  const screenOptions = { headerShown: false, ...defaultScreenOptions };
  return (
    <HomeDrawerStack.Navigator
      id="HomeDrawerStackNavigator"
      initialRouteName="StackHomeStack"
      screenOptions={screenOptions}
    >
      <HomeDrawerStack.Screen
        name="StackHomeStack"
        component={TabNavigator}
        options={({ route: { params } }) => ({
          title: 'Home',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
    </HomeDrawerStack.Navigator>
  );
};

export default HomeDrawerStackNavigator;
