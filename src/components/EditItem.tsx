import { Dispatch, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import {
  CANCEL_EDIT_ITEM,
  CONFIRM_EDIT_ITEM,
  EDIT_ITEM_NAME_INPUT,
} from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS, PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface EditItemProps {
  itemId: UUID;
  item: DiscriminatedItem;
  setEditItemModalVisible: Dispatch<boolean>;
  refreshItem: () => void;
}

const EditItem: FC<EditItemProps> = ({
  itemId,
  item,
  setEditItemModalVisible,
  refreshItem,
}) => {
  const [itemName, setItemName] = useState<string | undefined>(item.name);
  const { t } = useTranslation();
  const { mutations } = useQueryClient();
  const editItemMutation = mutations.useEditItem();

  const mutateItem = async () => {
    const itemNameSingleSpaces = itemName?.replace(/ +(?= )/g, '');
    editItemMutation.mutate({ id: itemId, name: itemNameSingleSpaces });
    setEditItemModalVisible(false);
    await customAnalyticsEvent(ANALYTICS_EVENTS.EDIT_ITEM, {
      itemType: item.type,
    });
    refreshItem();
  };

  return (
    <>
      <Input
        label={t('Item name')}
        placeholder={t('Item name')}
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
        testID={EDIT_ITEM_NAME_INPUT}
      />
      <View style={styles.acceptSaveItem}>
        <Button
          title={t('Save')}
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={mutateItem}
          testID={CONFIRM_EDIT_ITEM}
        />
      </View>
      <Button
        title={t('Cancel')}
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={() => setEditItemModalVisible(false)}
        testID={CANCEL_EDIT_ITEM}
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
