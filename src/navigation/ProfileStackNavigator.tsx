import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import ProfileScreen from '../screens/ProfileScreen';

export type ProfileStackParamList = {
  ProfileStackProfile: undefined;
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      id="ProfileStackNavigator"
      initialRouteName="ProfileStackProfile"
      screenOptions={defaultScreenOptions}
    >
      <ProfileStack.Screen
        name="ProfileStackProfile"
        component={ProfileScreen}
        options={() => ({
          title: '',
          headerLeft: () => <Header title="Profile" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
        })}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
