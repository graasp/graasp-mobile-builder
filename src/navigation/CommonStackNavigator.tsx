import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button } from 'react-native-elements';

import { defaultScreenOptions } from '../config/constants/navigation';
import { useView } from '../context/ViewContext';
import DetailsScreen from '../screens/DetailsScreen';
import FolderScreen from '../screens/FolderScreen';
import ItemScreen from '../screens/ItemScreen';
import { UUID } from '../types';

export type CommonStackParamList = {
  CommonStackFolder: { headerTitle: string; itemId: UUID };
  CommonStackItem: { headerTitle: string; itemId: UUID };
  CommonStackDetail: { itemId: UUID };
};

const CommonStack = createStackNavigator<CommonStackParamList>();

const CommonStackNavigator = () => {
  const { isPlayerView, setIsPlayerView } = useView();
  const viewIcon = isPlayerView ? 'folder-open' : 'play-circle-outline';

  return (
    <CommonStack.Navigator
      id="CommonStackNavigator"
      initialRouteName="CommonStackFolder"
      screenOptions={defaultScreenOptions}
    >
      <CommonStack.Screen
        name="CommonStackFolder"
        component={FolderScreen}
        options={({
          route: {
            params: { headerTitle },
          },
        }) => ({
          title: headerTitle,
          headerTitleAlign: 'center',
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
        })}
      />
      <CommonStack.Screen
        name="CommonStackItem"
        component={ItemScreen}
        options={({
          route: {
            params: { headerTitle },
          },
        }) => ({
          title: headerTitle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerRight: () => (
            <Button
              disabled
              disabledStyle={{ backgroundColor: '#5050d2' }}
              icon={
                <MaterialIcons
                  name={'ios-share'}
                  color="rgba(255,255,255,0.3)"
                  size={25}
                  style={{ paddingRight: 3 }}
                />
              }
            ></Button>
          ),
        })}
      />
      <CommonStack.Screen
        name="CommonStackDetail"
        component={DetailsScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
      />
    </CommonStack.Navigator>
  );
};

export default CommonStackNavigator;
