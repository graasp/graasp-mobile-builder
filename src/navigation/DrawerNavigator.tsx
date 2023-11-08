import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Divider, Text } from 'react-native-elements';
import Toast from 'react-native-toast-message';

import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import HomeDrawerStackNavigator, {
  HomeDrawerParamList,
} from './HomeDrawerStackNavigator';
import ProfileStackNavigator, {
  ProfileStackParamList,
} from './ProfileStackNavigator';

interface CustomDrawerContentProps {
  props: any;
}

export type DrawerParamList = {
  HomeDrawer: NavigatorScreenParams<HomeDrawerParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent: FC<CustomDrawerContentProps> = (props: any) => {
  const authContext = useAuth();
  const { signOut } = authContext;
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView {...props}>
      <Text h3 style={styles.drawerTitle}>
        Graasp
      </Text>
      <Divider
        style={{ width: '90%', marginHorizontal: 10, marginBottom: 10 }}
      />
      <DrawerItemList {...props} />
      <DrawerItem
        label={t('Help')!}
        icon={({ color, size, focused }) => (
          <Feather name="external-link" size={size} color={color} />
        )}
        onPress={() =>
          Linking.openURL('mailto:contact@graasp.org').catch(() => {
            Toast.show({
              text1: 'Sorry, we could not open your mail app',
              text2: 'Send an email to contact@graasp.org',
              type: 'error',
            });
          })
        }
      />
      <DrawerItem
        label={t('Log Out')!}
        icon={({ color, size, focused }) => (
          <MaterialIcons name="logout" size={size} color={color} />
        )}
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { t } = useTranslation();

  return (
    <Drawer.Navigator
      id="DrawerNavigator"
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      initialRouteName="HomeDrawer"
      screenOptions={{
        drawerType: 'front',
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeDrawerStackNavigator}
        options={({ route }) => ({
          drawerLabel: t('Home')!,
          drawerIcon: ({ color, focused, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
          drawerActiveTintColor: '#5050d2',
        })}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          drawerLabel: t('Profile')!,
          drawerIcon: ({ color, focused, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          drawerActiveTintColor: '#5050d2',
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerTitle: {
    color: '#5050d2',
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default DrawerNavigator;
