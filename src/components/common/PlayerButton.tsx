import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { Context, DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { buildPlayerButtonId } from '../../../e2e/constants/testIds';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../../config/constants/constants';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM,
  ITEM_NAVIGATOR_PLAYER_FOLDER,
} from '../../navigation/names';
import { ItemScreenProps } from '../../navigation/types';

type Props = {
  itemId: DiscriminatedItem['id'];

  type: DiscriminatedItem['type'];
  name: DiscriminatedItem['name'];
  size?: number;
  color?: string;

  origin: { rootId: DiscriminatedItem['id']; context: Context };
};

const PlayerButton = ({
  itemId,
  origin,
  type,
  name,
  size = 24,
  color = ITEMS_TABLE_ROW_ICON_COLOR,
}: Props) => {
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  function handleItemPress() {
    switch (type) {
      case ItemType.FOLDER:
        navigate(ITEM_NAVIGATOR, {
          screen: ITEM_NAVIGATOR_PLAYER_FOLDER,
          params: {
            itemId,
            headerTitle: name,
            origin,
          },
        });

        break;
      case ItemType.LINK:
      case ItemType.APP:
      case ItemType.DOCUMENT:
      case ItemType.S3_FILE:
        navigate(ITEM_NAVIGATOR, {
          screen: ITEM_NAVIGATOR_ITEM,
          params: { itemId, headerTitle: name },
        });
        break;
    }
  }

  return (
    <Button
      buttonStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
      icon={
        <MaterialIcons
          type="material"
          name="play-circle-outline"
          size={size}
          color={color}
        />
      }
      onPress={() => handleItemPress()}
      testID={buildPlayerButtonId(itemId)}
    ></Button>
  );
};

export default PlayerButton;
