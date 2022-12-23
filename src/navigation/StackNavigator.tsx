import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button } from 'react-native-elements';

import DrawerHeader from '../components/common/DrawerHeader';
import { defaultScreenOptions } from '../config/constants/navigation';
import { useView } from '../context/ViewContext';
import HomeScreen from '../screens/HomeScreen';

export type StackParamList = {
  HomeStack: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const StackNavigator = () => {
  const { isPlayerView, setIsPlayerView } = useView();
  const viewIcon = isPlayerView ? 'folder-open' : 'play-circle-outline';

  return (
    <Stack.Navigator
      id="StackNavigator"
      initialRouteName="HomeStack"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{
          title: '',
          headerLeft: () => <DrawerHeader title="Home" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackTitleVisible: false,
          headerRight: () => (
            <Button
              buttonStyle={{ backgroundColor: '#5050d2' }}
              onPress={() => setIsPlayerView(!isPlayerView)}
              icon={
                <MaterialIcons
                  name={viewIcon}
                  color="#fff"
                  size={25}
                  style={{ paddingRight: 3 }}
                />
              }
            ></Button>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
