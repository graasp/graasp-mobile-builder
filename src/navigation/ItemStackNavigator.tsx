import { createStackNavigator } from '@react-navigation/stack';

import { HEADER_TITLE_ALIGN_FOR_TRUNCATION } from '../config/constants/constants';
import { defaultScreenOptions } from '../config/constants/navigation';
import ChatScreen from '../screens/ChatScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ItemScreen from '../screens/ItemScreen';
import MapViewScreen from '../screens/MapViewScreen';
import PlayerFolderScreen from '../screens/PlayerFolderScreen';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM,
  ITEM_NAVIGATOR_ITEM_DETAILS,
  ITEM_NAVIGATOR_MAP_VIEW,
  ITEM_NAVIGATOR_PLAYER_FOLDER,
} from './names';
import { ItemStackParamList } from './types';

const ItemStack = createStackNavigator<ItemStackParamList>();

const ItemStackNavigator = () => {
  return (
    <ItemStack.Navigator
      id={ITEM_NAVIGATOR}
      initialRouteName="ItemStackItem"
      screenOptions={defaultScreenOptions}
    >
      <ItemStack.Screen
        name={ITEM_NAVIGATOR_PLAYER_FOLDER}
        component={PlayerFolderScreen}
        getId={({ params }) => {
          return params?.itemId;
        }}
        options={({ route: { params } }) => ({
          title: params?.headerTitle,
          headerTitleAlign: HEADER_TITLE_ALIGN_FOR_TRUNCATION,
          // trick to force title ellipsis
          headerBackTitle: ' ',
        })}
      />
      <ItemStack.Screen
        name={ITEM_NAVIGATOR_MAP_VIEW}
        component={MapViewScreen}
        getId={({ params }) => {
          return params?.itemId;
        }}
        options={({ route: { params } }) => ({
          title: params?.headerTitle,
          headerTitleAlign: HEADER_TITLE_ALIGN_FOR_TRUNCATION,
          // trick to force title ellipsis
          headerBackTitle: ' ',
        })}
      />
      <ItemStack.Screen
        name={ITEM_NAVIGATOR_ITEM}
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
          headerTitleAlign: HEADER_TITLE_ALIGN_FOR_TRUNCATION,
          // trick to force title ellipsis
          headerBackTitle: ' ',
        })}
      />
      <ItemStack.Screen
        name={ITEM_NAVIGATOR_ITEM_DETAILS}
        component={DetailsScreen}
        options={{
          title: '',
        }}
      />
      <ItemStack.Screen
        name="ItemStackChat"
        component={ChatScreen}
        options={({
          route: {
            params: { headerTitle },
          },
        }) => ({
          title: headerTitle,
          headerTitleAlign: HEADER_TITLE_ALIGN_FOR_TRUNCATION,
          // trick to force title ellipsis
          headerBackTitle: ' ',
        })}
      />
    </ItemStack.Navigator>
  );
};

export default ItemStackNavigator;
