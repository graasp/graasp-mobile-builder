import React, { FC } from 'react';
import { ActivityIndicator as ActInd, StyleSheet, View } from 'react-native';

interface ActivityIndicatorProps {
  color?: string;
  size?: 'small' | 'large' | undefined;
}

const ActivityIndicator: FC<ActivityIndicatorProps> = ({
  color = '#5050d2',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActInd size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicator;
