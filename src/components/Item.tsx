import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';

import { Context, DiscriminatedItem, ItemType, UUID } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { ITEM_LIST, ITEM_LIST_OPTIONS } from '../../e2e/constants/testIds';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../config/constants/constants';
import { ITEM_NAVIGATOR, ITEM_NAVIGATOR_ITEM } from '../navigation/names';
import { ItemScreenProps } from '../navigation/types';
import ItemIcon from './ItemIcon';
import PlayerButton from './common/PlayerButton';

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
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  async function handleItemPress() {
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_ITEM,
      params: { itemId: id, headerTitle: name },
    });
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
      <Pressable onPress={() => handleItemPress()} style={{ flex: 2 }}>
        {renderListItem()}
      </Pressable>
      {openOptions && (
        <>
          {type === ItemType.FOLDER && (
            <PlayerButton
              name={name}
              type={type}
              itemId={id}
              origin={{ rootId: id, context: Context.Builder }}
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
