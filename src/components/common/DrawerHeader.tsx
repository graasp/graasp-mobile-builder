import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { headerTextStyles } from '../../config/constants/navigation';

interface DrawerHeaderProps {
  title: string;
}

const DrawerHeader: FC<DrawerHeaderProps> = ({ title }) => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Ionicons name="ios-menu-sharp" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  header: headerTextStyles,
});

export default DrawerHeader;
