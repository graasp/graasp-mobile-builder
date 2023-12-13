import { useTranslation } from 'react-i18next';

import { Entypo, MaterialIcons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  HOME_TAB,
  MY_ITEMS_TAB,
  PROFILE_TAB,
  SHARED_ITEMS_TAB,
  SIGN_IN_TAB,
} from '../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import LibraryIcon from '../screens/library/LibraryIcon';
import BookmarksStackNavigator from './BookmarksNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import LibraryStackNavigator from './LibraryNavigator';
import MyItemsStackNavigator from './MyItemsStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import SharedStackNavigator from './SharedStackNavigator';
import {
  ROOT_NAVIGATOR_SIGN_IN,
  TAB_NAVIGATOR,
  TAB_NAVIGATOR_BOOKMARKS,
  TAB_NAVIGATOR_HOME,
  TAB_NAVIGATOR_LIBRARY,
  TAB_NAVIGATOR_MY_ITEMS,
  TAB_NAVIGATOR_PROFILE,
  TAB_NAVIGATOR_SHARED,
  TAB_NAVIGATOR_SIGN_IN,
} from './names';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const TabNavigator = () => {
  const { t } = useTranslation();
  const { hooks } = useQueryClient();
  const { data: currentMember } = hooks.useCurrentMember();

  return (
    <Tab.Navigator
      id={TAB_NAVIGATOR}
      initialRouteName={TAB_NAVIGATOR_HOME}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name={TAB_NAVIGATOR_HOME}
        component={HomeStackNavigator}
        options={({ route }) => ({
          tabBarLabel: t('Home'),
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarTestID: HOME_TAB,
        })}
      />
      <Tab.Screen
        name={TAB_NAVIGATOR_BOOKMARKS}
        component={BookmarksStackNavigator}
        options={({ route }) => ({
          tabBarLabel: t('Bookmarks'),
          tabBarIcon: ({ color, size }) => (
            <Entypo name="bookmarks" size={size} color={color} />
          ),
          tabBarActiveTintColor: PRIMARY_COLOR,
        })}
      />
      <Tab.Screen
        name={TAB_NAVIGATOR_LIBRARY}
        component={LibraryStackNavigator}
        options={() => ({
          tabBarLabel: t('Library'),
          tabBarIcon: ({ focused }) => (
            <LibraryIcon primaryColor={focused ? PRIMARY_COLOR : 'grey'} />
          ),

          tabBarActiveTintColor: PRIMARY_COLOR,
        })}
      />
      {currentMember ? (
        <>
          <Tab.Screen
            name={TAB_NAVIGATOR_MY_ITEMS}
            component={MyItemsStackNavigator}
            options={{
              tabBarLabel: t('My Items'),
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="folder" size={size} color={color} />
              ),
              tabBarActiveTintColor: PRIMARY_COLOR,
              tabBarTestID: MY_ITEMS_TAB,
            }}
          />
          <Tab.Screen
            name={TAB_NAVIGATOR_SHARED}
            component={SharedStackNavigator}
            options={{
              tabBarLabel: t('Shared Items'),
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="folder-shared" size={size} color={color} />
              ),
              tabBarActiveTintColor: PRIMARY_COLOR,
              tabBarTestID: SHARED_ITEMS_TAB,
            }}
          />
          <Tab.Screen
            name={TAB_NAVIGATOR_PROFILE}
            component={ProfileStackNavigator}
            options={{
              tabBarLabel: t('Profile'),
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name="account-circle"
                  size={size}
                  color={color}
                />
              ),
              tabBarActiveTintColor: PRIMARY_COLOR,
              tabBarTestID: PROFILE_TAB,
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name={TAB_NAVIGATOR_SIGN_IN}
          navigationKey="SignIn"
          // component is not used as we navigate to higher stack for signin
          // it avoids showing tabs in the signin screen
          component={ProfileStackNavigator}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();

              // Do something with the `navigation` object
              navigation.navigate(ROOT_NAVIGATOR_SIGN_IN);
            },
          })}
          options={{
            tabBarLabel: t('Sign In'),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="login" size={size} color={color} />
            ),
            tabBarActiveTintColor: PRIMARY_COLOR,
            tabBarTestID: SIGN_IN_TAB,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
