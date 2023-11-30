import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import ItemIcon from '../../components/ItemIcon';
import { useQueryClient } from '../../context/QueryClientContext';

type Props = {
  item: DiscriminatedItem;
};

function CollectionContent({ item }: Props) {
  const { t } = useTranslation();
  const { hooks } = useQueryClient();
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
            <View key={c.id} style={styles.files}>
              <ItemIcon type={c.type} extra={c.extra} />
              <Text>{c.name}</Text>
            </View>
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
});

export default CollectionContent;
