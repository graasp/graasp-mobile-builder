import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DrawerParamList } from '../navigation/DrawerNavigator';
import { ProfileStackParamList } from '../navigation/ProfileStackNavigator';

type ProfileStackProfileProps = CompositeScreenProps<
  StackScreenProps<
    ProfileStackParamList,
    'ProfileStackProfile',
    'ProfileStackNavigator'
  >,
  DrawerScreenProps<DrawerParamList>
>;

const ProfileScreen: FC<ProfileStackProfileProps> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
