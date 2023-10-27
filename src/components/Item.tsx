import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';

import { DiscriminatedItem, ItemType, UUID } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { ITEMS_TABLE_ROW_ICON_COLOR } from '../config/constants/constants';
import { HomeStackPropsNavigationProp } from '../screens/HomeScreen';
import ItemIcon from './ItemIcon';

interface ItemProps {
  item: DiscriminatedItem;
  openOptions?: ({ id }: { id: UUID }) => void;
}

const Item: FC<ItemProps> = ({
  item: { id, name, type, extra },
  openOptions,
}) => {
  const { navigate, push } = useNavigation<HomeStackPropsNavigationProp>();
  async function handleItemPress() {
    switch (type) {
      case ItemType.FOLDER:
        push('CommonStack', {
          screen: 'CommonStackFolder',
          params: { itemId: id, headerTitle: name },
        });
        break;
      case ItemType.LINK:
      case ItemType.APP:
      case ItemType.DOCUMENT:
      case ItemType.S3_FILE:
        push('CommonStack', {
          screen: 'CommonStackItem',
          params: { itemId: id, headerTitle: name },
        });
        break;
    }
  }

  function renderListItem() {
    return (
      <ListItem
        hasTVPreferredFocus={undefined}
        tvParallaxProperties={undefined}
      >
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
      {openOptions && (
        <Icon
          type="material"
          name="more-vert"
          size={24}
          color={ITEMS_TABLE_ROW_ICON_COLOR}
          onPress={() => openOptions({ id })}
          containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
          tvParallaxProperties={undefined}
        />
      )}
    </View>
  );
};

export default Item;
