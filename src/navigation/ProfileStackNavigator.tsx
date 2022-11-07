import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ProfileScreen from '../screens/ProfileScreen';
import { defaultScreenOptions } from '../config/constants/navigation';
import DrawerHeader from '../components/common/DrawerHeader';

export type ProfileStackParamList = {
  ProfileStackProfile: undefined;
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator id="ProfileStackNavigator" initialRouteName="ProfileStackProfile" screenOptions={defaultScreenOptions}>
      <ProfileStack.Screen
        name="ProfileStackProfile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: '',
          headerLeft: () => <DrawerHeader title="Profile" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
        })}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileStackNavigator;
