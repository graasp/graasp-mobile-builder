import { useTranslation } from 'react-i18next';

import { Entypo, MaterialIcons } from '@expo/vector-icons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import HomeStackNavigator, { HomeStackParamList } from './HomeStackNavigator';
import MyItemsStackNavigator from './MyItemsStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import SharedStackNavigator, {
  SharedStackParamList,
} from './SharedStackNavigator';

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  MyItemsTab: NavigatorScreenParams<StackParamList>;
  SharedTab: NavigatorScreenParams<SharedStackParamList>;
  SignInTab: any;
};

const Tab = createBottomTabNavigator<TabParamList>();
const TabNavigator = () => {
  const { t } = useTranslation();
  const { hooks } = useQueryClient();
  const { data: currentMember } = hooks.useCurrentMember();

  return (
    <Tab.Navigator
      id="TabNavigator"
      initialRouteName="HomeTab"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={({ route }) => ({
          tabBarLabel: t('Home')!,
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          tabBarActiveTintColor: PRIMARY_COLOR,
        })}
      />
      {currentMember ? (
        <>
          <Tab.Screen
            name="MyItemsTab"
            component={MyItemsStackNavigator}
            options={{
              tabBarLabel: t('My Items')!,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="folder" size={size} color={color} />
              ),
              tabBarActiveTintColor: PRIMARY_COLOR,
            }}
          />
          <Tab.Screen
            name="SharedTab"
            component={SharedStackNavigator}
            options={{
              tabBarLabel: t('Shared Items')!,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="folder-shared" size={size} color={color} />
              ),
              tabBarActiveTintColor: PRIMARY_COLOR,
            }}
          />
          <Tab.Screen
            name="SignInTab"
            component={ProfileStackNavigator}
            options={{
              tabBarLabel: t('Profile')!,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name="account-circle"
                  size={size}
                  color={color}
                />
              ),
              tabBarActiveTintColor: PRIMARY_COLOR,
            }}
          />
        </>
      ) : (
        <Tab.Screen
          name="SignInTab"
          navigationKey="SignIn"
          // component is not used as we navigate to higher stack for signin
          // it avoids showing tabs in the signin screen
          component={ProfileStackNavigator}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();

              // Do something with the `navigation` object
              navigation.navigate('SignIn');
            },
          })}
          options={{
            tabBarLabel: t('Sign In')!,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="login" size={size} color={color} />
            ),
            tabBarActiveTintColor: PRIMARY_COLOR,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
