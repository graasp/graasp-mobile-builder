import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { ITEMS_TABLE_ROW_ICON_COLOR } from '../../config/constants/constants';
import { ItemScreenProps } from '../../navigation/types';

type Props = {
  itemId: DiscriminatedItem['id'];
  type: DiscriminatedItem['type'];
  name: DiscriminatedItem['name'];
  size?: number;
};

const PlayerButton = ({ itemId, type, name, size = 24 }: Props) => {
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  function handleItemPress() {
    switch (type) {
      case ItemType.FOLDER:
        navigate('ItemStack', {
          screen: 'ItemStackPlayerFolder',
          params: {
            itemId,
            headerTitle: name,
          },
        });

        break;
      case ItemType.LINK:
      case ItemType.APP:
      case ItemType.DOCUMENT:
      case ItemType.S3_FILE:
        navigate('ItemStack', {
          screen: 'ItemStackItem',
          params: { itemId, headerTitle: name },
        });
        break;
    }
  }

  return (
    <MaterialIcons
      type="material"
      name="play-circle-outline"
      size={size}
      color={ITEMS_TABLE_ROW_ICON_COLOR}
      onPress={() => handleItemPress()}
      //   containerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
    />
  );
};

export default PlayerButton;
