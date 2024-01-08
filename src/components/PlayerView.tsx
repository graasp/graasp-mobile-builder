import { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Context, DiscriminatedItem } from '@graasp/sdk';

import { divideContentAndFolderItems } from '../utils/functions/item';
import ActivityIndicator from './ActivityIndicator';
import PlayerFolderMenu from './PlayerFolderMenu';
import PlayerItem from './PlayerItem';
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
    <>
      {/* <View renderToHardwareTextureAndroid={true}> */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {contentItems.length === 0 ? (
          <EmptyList />
        ) : (
          contentItems.map((item) => (
            <>
              {/* todo:padding */}
              <PlayerItem key={item.id + 'item'} item={item} />
              <View
                key={item.id + 'bottomspace'}
                style={styles.bottomSpace}
              ></View>
            </>
          ))
        )}
      </ScrollView>
      {/* </View> */}
      {folderItems.length !== 0 && (
        <PlayerFolderMenu origin={origin} folderItems={folderItems} />
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
