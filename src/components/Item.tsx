import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem, ItemType, UUID } from '@graasp/sdk';

import { useNavigation, useRoute } from '@react-navigation/native';

import { ITEM_LIST, ITEM_LIST_OPTIONS } from '../../e2e/constants/testIds';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../config/constants/constants';
import ItemIcon from './ItemIcon';

interface ItemProps {
  item: DiscriminatedItem;
  openOptions?: ({ id }: { id: UUID }) => void;
  index: number;
  parentItemId?: UUID;
}

const Item: FC<ItemProps> = ({
  item: { id, name, type, extra },
  openOptions,
  index,
  parentItemId,
}) => {
  const { navigate } = useNavigation<any>();
  const { params } = useRoute<any>();
  async function handleItemPress(isPlayer: boolean) {
    switch (type) {
      case ItemType.FOLDER:
        if (isPlayer) {
          navigate('CommonStack', {
            screen: 'CommonStackPlayerFolder',
            params: {
              itemId: id,
              headerTitle: name,
              builderItemId: params?.builderItemId || parentItemId,
            },
          });
        } else {
          navigate('CommonStack', {
            screen: 'CommonStackFolder',
            params: { itemId: id, headerTitle: name },
          });
        }

        break;
      case ItemType.LINK:
      case ItemType.APP:
      case ItemType.DOCUMENT:
      case ItemType.S3_FILE:
        navigate('CommonStack', {
          screen: 'CommonStackItem',
          params: { itemId: id, headerTitle: name },
        });
        break;
    }
  }

  function renderListItem() {
    return (
      <ListItem testID={`${ITEM_LIST}-${index + 1}`}>
        <ItemIcon type={type} extra={extra} />
        <ListItem.Content style={{ flexDirection: 'row' }}>
          <ListItem.Title style={{ flex: 2 }}>{name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={() => handleItemPress(false)} style={{ flex: 2 }}>
        {renderListItem()}
      </Pressable>
      {openOptions && (
        <>
          {type === ItemType.FOLDER && (
            <MaterialIcons
              type="material"
              name="play-circle-outline"
              size={24}
              color={ITEMS_TABLE_ROW_ICON_COLOR}
              onPress={() => handleItemPress(true)}
              containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
            />
          )}
          <Icon
            type="material"
            name="more-vert"
            size={24}
            color={ITEMS_TABLE_ROW_ICON_COLOR}
            onPress={() => openOptions({ id })}
            containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
            testID={`${ITEM_LIST_OPTIONS}-${index + 1}`}
          />
        </>
      )}
    </View>
  );
};

export default Item;
