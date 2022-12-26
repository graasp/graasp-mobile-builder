import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useMutation } from 'react-query';

import { buildDeleteItem } from '../mutations/utils';
import { Item, UUID } from '../types';
import { getUserToken } from '../utils/functions/token';

interface DeleteItemProps {
  itemId: UUID;
  item: Item;
  setDeleteItemModalVisible: React.Dispatch<
    React.SetStateAction<{
      toggle: boolean;
      itemId: UUID | null;
    }>
  >;
  refresh: () => void;
}

const DeleteItem: FC<DeleteItemProps> = ({
  itemId,
  item,
  setDeleteItemModalVisible,
  refresh,
}) => {
  const { t } = useTranslation();
  const userToken: any = getUserToken();
  const deleteItemMutation = useMutation({
    ...buildDeleteItem(userToken, refresh),
  });

  const deleteItem = () => {
    deleteItemMutation.mutate(itemId);
    setDeleteItemModalVisible({ toggle: false, itemId: null });
  };

  const cancelDeleteItem = () => {
    setDeleteItemModalVisible({ toggle: false, itemId: null });
  };

  return (
    <>
      <Text style={styles.value}>{`${t('Delete')} ${item.name}?`}</Text>
      <View style={styles.deleteItem}>
        <Button
          title={t('Delete item')!}
          raised={true}
          buttonStyle={{ backgroundColor: '#5050d2' }}
          onPress={deleteItem}
        />
      </View>
      <Button
        title={t('Cancel')!}
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={cancelDeleteItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  deleteItem: {
    marginBottom: 10,
  },
  value: {
    paddingBottom: 30,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DeleteItem;
