import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { Pressable, View } from 'react-native';
import { ITEM_TYPES, ITEMS_TABLE_ROW_ICON_COLOR } from '../config/constants/constants';
import ItemIcon from './ItemIcon';
import { Item as ItemType, UUID } from '../types';
import { HomeStackPropsNavigationProp } from '../screens/HomeScreen';

interface ItemProps {
  item: ItemType;
  openOptions: ({ id }: { id: UUID }) => void;
}

const Item: FC<ItemProps> = ({
  item: { id, name, type, extra },
  openOptions,
}) => {
  const { navigate, push } = useNavigation<HomeStackPropsNavigationProp>();
  async function handleItemPress() {
    switch (type) {
      case ITEM_TYPES.FOLDER:
        push('CommonStack', {
          screen: 'CommonStackFolder',
          params: { itemId: id, headerTitle: name },
        });
        break;
      case ITEM_TYPES.S3_FILE:
        push('CommonStack', {
            screen: 'CommonStackItem',
            params: { itemId: id, headerTitle: name },
          });
        break;
      case ITEM_TYPES.LINK:
      case ITEM_TYPES.APP:
      case ITEM_TYPES.DOCUMENT:
        push('CommonStack', {
          screen: 'CommonStackItem',
          params: { itemId: id, headerTitle: name },
        });
        break;
    }
  }

  function renderListItem() {
    return (
      <ListItem hasTVPreferredFocus={undefined} tvParallaxProperties={undefined}>
        <ItemIcon type={type} extra={extra} name={name} />
        <ListItem.Content style={{ flexDirection: 'row' }}>
          <ListItem.Title style={{ flex: 2 }}>{name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={handleItemPress} style={{ flex: 2 }}>
        {renderListItem()}
      </Pressable>
      <Icon
        type="material"
        name="more-vert"
        size={24}
        color={ITEMS_TABLE_ROW_ICON_COLOR}
        onPress={() => openOptions({ id })}
        containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
        tvParallaxProperties={undefined}
      />
    </View>
  );
}

export default Item;
