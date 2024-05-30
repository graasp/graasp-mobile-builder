import { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { Context, DiscriminatedItem } from '@graasp/sdk';

import { divideContentAndFolderItems } from '../utils/functions/item';
import ActivityIndicator from './ActivityIndicator';
import PlayerFolderMenu from './PlayerFolderMenu';
import PlayerItem from './PlayerItem';
import ContainsOnlyFolderContent from './common/ContainsOnlyFolderContent';
import EmptyList from './common/EmptyList';

interface PlayerViewProps {
  children: DiscriminatedItem[];
  origin: { rootId: DiscriminatedItem['id']; context: Context };
}

const PlayerView: FC<PlayerViewProps> = ({ origin, children }) => {
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
    // do not add a view here because it might contain a link - webview
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {children.length === 0 && <EmptyList />}
        {contentItems.length === 0 && folderItems.length !== 0 ? (
          <ContainsOnlyFolderContent />
        ) : (
          contentItems.map((item) => (
            <>
              <View key={item.id + '-topspace'} style={styles.topSpace}></View>
              <PlayerItem key={item.id + '-item'} item={item} />
              <View
                key={item.id + '-bottomspace'}
                style={styles.bottomSpace}
              ></View>
            </>
          ))
        )}
      </ScrollView>
      {folderItems.length !== 0 && (
        <PlayerFolderMenu origin={origin} folderItems={folderItems} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  topSpace: {
    height: 20,
  },
  flatList: {
    height: '100%',
  },
  bottomSpace: {
    height: 20,
  },
});

export default PlayerView;
