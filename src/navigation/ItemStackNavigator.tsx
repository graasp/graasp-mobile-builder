import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { defaultScreenOptions } from '../config/constants/navigation';
import DetailsScreen from '../screens/DetailsScreen';
import ItemScreen from '../screens/ItemScreen';
import PlayerFolderScreen from '../screens/PlayerFolderScreen';
import { ItemStackParamList } from './types';

const ItemStack = createStackNavigator<ItemStackParamList>();

const ItemStackNavigator = () => {
  return (
    <ItemStack.Navigator
      id="ItemStack"
      initialRouteName="ItemStackItem"
      screenOptions={defaultScreenOptions}
    >
      <ItemStack.Screen
        name="ItemStackPlayerFolder"
        component={PlayerFolderScreen}
        getId={({ params }) => {
          return params?.itemId;
        }}
        options={({ route: { params } }) => ({
          title: params?.headerTitle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <ItemStack.Screen
        name="ItemStackItem"
        component={ItemScreen}
        getId={({ params }) => {
          return params?.itemId;
        }}
        options={({
          route: {
            params: { headerTitle },
          },
        }) => ({
          title: headerTitle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        })}
      />
      <ItemStack.Screen
        name="ItemStackDetail"
        component={DetailsScreen}
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
      />
    </ItemStack.Navigator>
  );
};

export default ItemStackNavigator;
