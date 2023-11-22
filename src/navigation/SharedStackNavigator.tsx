import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/common/Header';
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
          headerLeft: () => <Header title="Shared Items" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
        }}
      />
    </SharedStack.Navigator>
  );
};

export default SharedStackNavigator;
