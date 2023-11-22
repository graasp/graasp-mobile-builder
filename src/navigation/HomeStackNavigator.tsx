import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import HomeScreen, { HomeStackProps } from '../screens/home/HomeScreen';

export type HomeStackParamList = {
  HomeStack: HomeStackProps;
};

export type HomeStackNavigationProp = StackNavigationProp<HomeStackProps>;
const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      id="HomeStackNavigator"
      initialRouteName="HomeStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="HomeStack"
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
