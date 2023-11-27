import { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DiscriminatedItem } from '@graasp/sdk';

import { divideContentAndFolderItems } from '../utils/functions/item';
import ActivityIndicator from './ActivityIndicator';
import PlayerFolderMenu from './PlayerFolderMenu';
import PlayerItem from './PlayerItem';
import EmptyList from './common/EmptyList';

interface PlayerViewProps {
  children: DiscriminatedItem[];
}

const PlayerView: FC<PlayerViewProps> = ({ children }) => {
  const [folderItems, setFolderItems] = useState<DiscriminatedItem[] | null>(
    null,
  );
  const [contentItems, setContentItems] = useState<DiscriminatedItem[] | null>(
    null,
  );

  useEffect(() => {
    if (children) {
      const { folders, content } = divideContentAndFolderItems(children);
      setFolderItems(folders);
      setContentItems(content);
    }
  }, [children]);

  if (!contentItems || !folderItems) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <View>
        <ScrollView>
          {contentItems.length === 0 ? (
            <EmptyList />
          ) : (
            contentItems.map((item) => (
              <View key={item.id} style={styles.item}>
                <PlayerItem item={item} />
                <View style={styles.bottomSpace}></View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      {folderItems.length !== 0 && (
        <PlayerFolderMenu folderItems={folderItems} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingTop: 20,
  },
  flatList: {
    height: '100%',
  },
  bottomSpace: {
    height: 120,
  },
});

export default PlayerView;
