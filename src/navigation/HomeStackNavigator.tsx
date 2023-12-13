import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import HomeScreen from '../screens/home/HomeScreen';
import { HOME_NAVIGATOR, HOME_NAVIGATOR_HOME } from './names';
import { HomeStackParamList } from './types';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      id={HOME_NAVIGATOR}
      initialRouteName="HomeStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name={HOME_NAVIGATOR_HOME}
        component={HomeScreen}
        options={{
          title: '',
          headerLeft: () => <Header title="Home" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
