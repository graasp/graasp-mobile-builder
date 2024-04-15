import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import {
  CANCEL_DELETE_ITEM,
  CONFIRM_DELETE_ITEM,
} from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS, PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface DeleteItemProps {
  itemId: UUID;
  item: DiscriminatedItem;
  setDeleteItemModalVisible: React.Dispatch<boolean>;
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  refresh: () => void;
}

const DeleteItem: FC<DeleteItemProps> = ({
  itemId,
  item,
  setDeleteItemModalVisible,
  bottomSheetModalRef,
}) => {
  const { t } = useTranslation();
  const { mutations } = useQueryClient();
  const deleteItemMutation = mutations.useRecycleItems();

  const deleteItem = async () => {
    deleteItemMutation.mutate([itemId]);
    setDeleteItemModalVisible(false);
    bottomSheetModalRef.current?.close();
    await customAnalyticsEvent(ANALYTICS_EVENTS.DELETE_ITEM, {
      itemType: item.type,
    });
  };

  const cancelDeleteItem = () => {
    setDeleteItemModalVisible(false);
  };

  return (
    <>
      <Text style={styles.value}>{`${t('Delete')} ${item.name}?`}</Text>
      <View style={styles.deleteItem}>
        <Button
          title={t('Delete item')}
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={deleteItem}
          testID={CONFIRM_DELETE_ITEM}
        />
      </View>
      <Button
        title={t('Cancel')}
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={cancelDeleteItem}
        testID={CANCEL_DELETE_ITEM}
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
