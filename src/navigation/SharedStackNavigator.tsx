import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button } from 'react-native-elements';

import DrawerHeader from '../components/common/DrawerHeader';
import { defaultScreenOptions } from '../config/constants/navigation';
import { useView } from '../context/ViewContext';
import SharedScreen from '../screens/SharedScreen';

export type SharedStackParamList = {
  SharedStackShared: undefined;
};

const SharedStack = createStackNavigator<SharedStackParamList>();

const SharedStackNavigator = () => {
  const { isPlayerView, setIsPlayerView } = useView();
  const viewIcon = isPlayerView ? 'folder-open' : 'play-circle-outline';

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
          headerLeft: () => <DrawerHeader title="Shared Items" />,
          headerLeftContainerStyle: { paddingLeft: 10 },
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
    </SharedStack.Navigator>
  );
};

export default SharedStackNavigator;
