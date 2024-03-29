import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { DiscriminatedItem } from '@graasp/sdk';

import ActivityIndicator from '../../components/ActivityIndicator';
import ItemsList from '../../components/ItemsList';
import { useQueryClient } from '../../context/QueryClientContext';
import { getLocalBookmarkedItemIds } from '../../utils/bookmark';

const BookmarksScreen = () => {
  const { hooks } = useQueryClient();

  const insets = useSafeAreaInsets();
  const {
    data: bookmarkedItems,
    isLoading,
    refetch,
  } = hooks.useFavoriteItems();
  const { t } = useTranslation();

  const [localBookmarkedItemIds, setLocalBookmarkedItemIds] = useState<
    DiscriminatedItem['id'][]
  >([]);

  const { data: localBookmarkedItems } = hooks.useItems(localBookmarkedItemIds);

  const updateLocalBookmarks = async () => {
    const ids = await getLocalBookmarkedItemIds();
    if (ids !== localBookmarkedItemIds) {
      setLocalBookmarkedItemIds(ids);
    }
  };

  // get local bookmarked item ids
  useEffect(() => {
    updateLocalBookmarks();
    // loop to get updates -> necessary on remove from bookmarks
    const fn = setInterval(() => {
      updateLocalBookmarks();
    }, 3000);

    return () => clearInterval(fn);
  }, []);

  const renderLocalBookmarks = () => {
    const items = localBookmarkedItems
      ? Object.values(localBookmarkedItems.data)
      : undefined;
    if (items?.length) {
      return (
        <View style={styles.list}>
          <View
            style={{
              marginTop: insets.top / 2,
              ...styles.iconAndTitle,
            }}
          >
            <Text h4 style={styles.title}>
              {t('Local Bookmarks')}
            </Text>
          </View>

          <Text style={styles.info}>
            {t('Local Bookmarks are not synced with an account.')}
          </Text>
          <ItemsList
            displayAddItem={false}
            items={items}
            isLoading={isLoading}
            refresh={refetch}
          />
        </View>
      );
    }

    return null;
  };

  const renderBookmarks = () => {
    if (bookmarkedItems) {
      return (
        <View style={styles.list}>
          <View
            style={{
              marginTop: insets.top / 2,
              ...styles.iconAndTitle,
            }}
          >
            <Text h4 style={styles.title}>
              {t('Bookmarks')}
            </Text>
          </View>

          <ItemsList
            displayAddItem={false}
            items={[...(bookmarkedItems.map(({ item }) => item) ?? [])]}
            isLoading={isLoading}
            refresh={refetch}
          />
        </View>
      );
    }
    if (isLoading) {
      return <ActivityIndicator />;
    }

    return null;
  };

  if (!localBookmarkedItems && !bookmarkedItems?.length) {
    return (
      <Text
        h4
        style={{
          marginTop: insets.top,
          ...styles.noContent,
        }}
      >
        {t('No bookmarks were found')}
      </Text>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      {renderLocalBookmarks()}
      {renderBookmarks()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  iconAndTitle: {
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
  },
  info: {
    color: 'darkgrey',
    marginTop: 10,
    marginLeft: 16,
  },
  list: {},
  noContent: {
    textAlign: 'center',
  },
});

export default BookmarksScreen;
