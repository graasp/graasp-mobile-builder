import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { headerTextStyles } from '../../config/constants/navigation';

interface HeaderProps {
  title: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
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

export default Header;
