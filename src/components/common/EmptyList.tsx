import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text>No items found.</Text>
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
});

export default EmptyList;
