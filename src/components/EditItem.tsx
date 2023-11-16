import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { ANALYTICS_EVENTS, PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface EditItemProps {
  itemId: UUID;
  item: DiscriminatedItem;
  setEditItemModalVisible: React.Dispatch<
    React.SetStateAction<{
      toggle: boolean;
      itemId: UUID | null;
    }>
  >;
  refresh: () => void;
}

const EditItem: FC<EditItemProps> = ({
  itemId,
  item,
  setEditItemModalVisible,
  refresh,
}) => {
  const [itemName, setItemName] = useState<string | undefined>(item.name);
  const { t } = useTranslation();
  const { mutations } = useQueryClient();
  const editItemMutation = mutations.useEditItem();

  const mutateItem = async () => {
    const itemNameSingleSpaces = itemName?.replace(/ +(?= )/g, '');
    editItemMutation.mutate({ id: itemId, name: itemNameSingleSpaces });
    setEditItemModalVisible({ toggle: false, itemId: null });
    await customAnalyticsEvent(ANALYTICS_EVENTS.EDIT_ITEM, {
      itemType: item.type,
    });
  };

  return (
    <>
      <Input
        label={t('Item name')}
        placeholder={t('Item name')!}
        onChangeText={(value) => setItemName(value)}
        value={itemName}
        underlineColorAndroid={'black'}
        labelStyle={{
          color: 'black',
          fontWeight: '700',
        }}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#cccccc"
      />
      <View style={styles.acceptSaveItem}>
        <Button
          title={t('Save')!}
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={mutateItem}
        />
      </View>
      <Button
        title="Cancel"
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={() => setEditItemModalVisible({ toggle: false, itemId: null })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  acceptSaveItem: {
    marginTop: 30,
    marginBottom: 10,
  },
});

export default EditItem;
