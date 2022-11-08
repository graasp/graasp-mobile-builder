import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';

import SharedStackNavigator, {
  SharedStackParamList,
} from './SharedStackNavigator';
import StackNavigator, { StackParamList } from './StackNavigator';

export type TabParamList = {
  HomeTab: NavigatorScreenParams<StackParamList>;
  SharedTab: NavigatorScreenParams<SharedStackParamList>;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      id="TabNavigator"
      initialRouteName="HomeTab"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="HomeTab"
        component={StackNavigator}
        options={({ route }) => ({
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="SharedTab"
        component={SharedStackNavigator}
        options={{
          tabBarLabel: 'Shared Items',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder-shared" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
