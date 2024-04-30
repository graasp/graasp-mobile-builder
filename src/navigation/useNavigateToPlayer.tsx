import { Context, DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM,
  ITEM_NAVIGATOR_PLAYER_FOLDER,
} from './names';
import { ItemScreenProps } from './types';

export const useNavigateToPlayer = () => {
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  const navigateToPlayer = ({
    type,
    itemId,
    name,
    origin,
  }: {
    type: DiscriminatedItem['type'];
    name: DiscriminatedItem['name'];
    itemId: DiscriminatedItem['id'];
    origin: { rootId: string; context: Context };
  }) => {
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
  };

  return navigateToPlayer;
};
