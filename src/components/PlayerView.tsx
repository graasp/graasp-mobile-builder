import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Divider, Tab } from 'react-native-elements';

import { Item as ItemType } from '../types';
import { divideContentAndFolderItems } from '../utils/functions/item';
import Item from './Item';
import PlayerItem from './PlayerItem';
import EmptyList from './common/EmptyList';
import { useTranslation } from 'react-i18next';

interface PlayerViewProps {
  children: ItemType[];
}

const tabHeaderHeight = 53;

const PlayerView: FC<PlayerViewProps> = ({ children }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [folderItems, setFolderItems] = useState<ItemType[] | null>(null);
  const [contentItems, setContentItems] = useState<ItemType[] | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (children) {
      const { folders, content } = divideContentAndFolderItems(children);
      setFolderItems(folders);
      setContentItems(content);
    }
  }, [children]);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Item
        item={item}
        openOptions={function ({ id }: { id: string }): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabHeaderView}>
        <Tab
          value={tabIndex}
          onChange={setTabIndex}
          indicatorStyle={{ backgroundColor: '#5050d2' }}
        >
          <Tab.Item
            title={t('content')!}
            buttonStyle={styles.tabButton}
            titleStyle={styles.tabTitle}
          />
          <Tab.Item
            title={t('folders')!}
            buttonStyle={styles.tabButton}
            titleStyle={styles.tabTitle}
          />
        </Tab>
      </View>

      {tabIndex === 1 && contentItems && folderItems && (
        <View style={styles.scrollViewStyles}>
          {
            <FlatList
              style={styles.flatList}
              data={folderItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
              contentContainerStyle={{ flexGrow: 1 }}
              ListEmptyComponent={<EmptyList />}
              ItemSeparatorComponent={() => (
                <Divider
                  style={{
                    width: '90%',
                    marginHorizontal: 10,
                    marginBottom: 10,
                  }}
                />
              )}
            />
          }
        </View>
      )}

      {tabIndex === 0 && contentItems && (
        <View style={styles.scrollViewStyles}>
          <ScrollView>
            {contentItems.length === 0 ? (
              <EmptyList />
            ) : (
              contentItems.map((item) => (
                <View key={item.id} style={styles.item}>
                  <PlayerItem item={item} />
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingTop: 20,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    overflowY: 'hidden',
  },
  tabHeaderView: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: tabHeaderHeight,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewStyles: {
    marginTop: tabHeaderHeight,
  },
  flatList: {
    height: '100%',
  },
  tabButton: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cdcdcd',
  },
  tabTitle: {
    color: '#5050d2',
    fontSize: 16,
  },
});

export default PlayerView;
