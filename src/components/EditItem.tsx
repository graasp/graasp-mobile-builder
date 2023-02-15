import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useMutation } from 'react-query';

import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { buildEditItem } from '../mutations/utils';
import { Item, UUID } from '../types';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { getUserToken } from '../utils/functions/token';

interface EditItemProps {
  itemId: UUID;
  item: Item;
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
  const userToken: any = getUserToken();
  const editItemMutation = useMutation({
    ...buildEditItem(userToken, refresh),
  });

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
        autoCompleteType={undefined}
      />
      <View style={styles.acceptSaveItem}>
        <Button
          title={t('Save')!}
          raised={true}
          buttonStyle={{ backgroundColor: '#5050d2' }}
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
