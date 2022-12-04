import React, { FC, useState } from 'react';
import { Button, Input } from 'react-native-elements';
import { useMutation } from 'react-query';

import { buildEditItem } from '../mutations/utils';
import { Item, UUID } from '../types';
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
  const userToken: any = getUserToken();
  const editItemMutation = useMutation({ ...buildEditItem(userToken, refresh) });

  const mutateItem = () => {
    const itemNameSingleSpaces = itemName?.replace(/ +(?= )/g, '');
    editItemMutation.mutate({ id: itemId, name: itemNameSingleSpaces });
    setEditItemModalVisible({ toggle: false, itemId: null });
  };

  return (
    <>
      <Input
        label="Item name"
        placeholder="Item name"
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
      <Button
        title="Edit item"
        raised={true}
        buttonStyle={{ backgroundColor: '#5050d2' }}
        onPress={mutateItem}
      />
    </>
  );
};

export default EditItem;
