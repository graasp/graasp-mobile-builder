import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
import { defaultScreenOptions } from '../config/constants/navigation';
import MyItemsScreen from '../screens/MyItemsScreen';

export type MyItemsStackParamList = {
  MyItemsStack: undefined;
};

const MyItemsStack = createStackNavigator<MyItemsStackParamList>();

const MyItemsStackNavigator = () => {
  return (
    <MyItemsStack.Navigator
      id="MyItemsStackNavigator"
      initialRouteName="MyItemsStack"
      screenOptions={defaultScreenOptions}
    >
      <MyItemsStack.Screen
        name="MyItemsStack"
        component={MyItemsScreen}
        options={{
          title: '',
          headerLeft: () => <Header title="My Items" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
        }}
      />
    </MyItemsStack.Navigator>
  );
};

export default MyItemsStackNavigator;