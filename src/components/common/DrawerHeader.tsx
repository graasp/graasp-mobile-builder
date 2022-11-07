import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { headerTextStyles } from '../../config/constants/navigation';
import { useNavigation } from '@react-navigation/native';

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
}

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
