import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import { useChildren } from '../hooks';
import { UUID } from '../types';
import ActivityIndicator from './ActivityIndicator';
import PlayerItem from './PlayerItem';

interface PlayerViewProps {
  itemId: UUID;
}

const PlayerView: FC<PlayerViewProps> = ({ itemId }) => {
  const { data: children, isLoading, isError } = useChildren(itemId);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !children) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {children.map((item) => (
        <View key={item.id} style={styles.item}>
          <PlayerItem item={item} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingTop: 20,
  },
});

export default PlayerView;
