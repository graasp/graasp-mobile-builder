import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import { defaultScreenOptions } from '../config/constants/navigation';
import DetailsScreen from '../screens/DetailsScreen';
import FolderScreen from '../screens/FolderScreen';
import ItemScreen from '../screens/ItemScreen';

export type CommonStackParamList = {
  CommonStackFolder: { headerTitle: string; itemId: UUID };
  CommonStackItem: { headerTitle: string; itemId: UUID };
  CommonStackDetail: { itemId: UUID };
};

export type CommonStackNavigationProp =
  StackNavigationProp<CommonStackParamList>;
const CommonStack = createStackNavigator<CommonStackParamList>();

const CommonStackNavigator = () => {
  return (
    <CommonStack.Navigator
      id="CommonStack"
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
              disabledStyle={{ backgroundColor: PRIMARY_COLOR }}
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
