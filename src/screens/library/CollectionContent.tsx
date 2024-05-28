import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import ItemIcon from '../../components/ItemIcon';
import { useQueryClient } from '../../context/QueryClientContext';
import { LIBRARY_NAVIGATOR_COLLECTION } from '../../navigation/names';
import { LibraryScreenProp } from '../../navigation/types';

type Props = {
  item: DiscriminatedItem;
};

function CollectionContent({ item }: Props) {
  const { t } = useTranslation();
  const { hooks } = useQueryClient();
  const { navigate } =
    useNavigation<LibraryScreenProp<'CollectionStack'>['navigation']>();
  const isFolder = item.type === ItemType.FOLDER;
  const { data: children } = hooks.useChildren(item.id, {
    enabled: isFolder,
  });

  if (!isFolder) {
    return null;
  }

  if (children?.length) {
    return (
      <>
        <Text h4 style={styles.title}>
          {t('Content')}
        </Text>
        {children?.length ? (
          children.map((c) => (
            <Pressable
              onPress={() =>
                navigate(LIBRARY_NAVIGATOR_COLLECTION, { itemId: c.id })
              }
            >
              <View key={c.id} style={styles.files}>
                <ItemIcon type={c.type} extra={c.extra} />
                <Text style={styles.name}>{c.name}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <>
            <Text>{t('This folder is empty')}</Text>
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    marginVertical: 10,
  },
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  files: {
    flexDirection: 'row',
    paddingVertical: 5,
    gap: 7,
  },
  name: {
    textDecorationLine: 'underline',
  },
});

export default CollectionContent;
