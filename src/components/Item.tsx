import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';

import { DiscriminatedItem, ItemType, UUID } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { ITEM_LIST, ITEM_LIST_OPTIONS } from '../../e2e/constants/testIds';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../config/constants/constants';
import { RootNavigationProp } from '../navigation/RootNavigator';
import ItemIcon from './ItemIcon';

interface ItemProps {
  item: DiscriminatedItem;
  openOptions?: ({ id }: { id: UUID }) => void;
  index: number;
}

const Item: FC<ItemProps> = ({
  item: { id, name, type, extra },
  openOptions,
  index,
}) => {
  const { navigate } = useNavigation<RootNavigationProp>();
  async function handleItemPress() {
    switch (type) {
      case ItemType.FOLDER:
        navigate('CommonStack', {
          screen: 'CommonStackFolder',
          params: {
            itemId: id,
            headerTitle: name,
          },
        });
        break;
      case ItemType.LINK:
      case ItemType.APP:
      case ItemType.DOCUMENT:
      case ItemType.S3_FILE:
        navigate('CommonStack', {
          screen: 'CommonStackItem',
          params: {
            itemId: id,
            headerTitle: name,
          },
        });
        break;
    }
  }

  function renderListItem() {
    return (
      <ListItem testID={`${ITEM_LIST}-${index + 1}`}>
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
          testID={`${ITEM_LIST_OPTIONS}-${index + 1}`}
        />
      )}
    </View>
  );
};

export default Item;
