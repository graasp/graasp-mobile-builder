import { Pressable } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { Context, DiscriminatedItem } from '@graasp/sdk';

import { buildPlayerButtonId } from '../../../e2e/constants/testIds';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../../config/constants/constants';
import { useNavigateToPlayer } from '../../navigation/useNavigateToPlayer';

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
  const navigateToPlayer = useNavigateToPlayer();

  return (
    <Pressable
      onPress={() => navigateToPlayer({ type, itemId, name, origin })}
      testID={buildPlayerButtonId(itemId)}
    >
      <MaterialIcons
        type="material"
        name="play-circle-outline"
        size={size}
        color={color}
      />
    </Pressable>
  );
};

export default PlayerButton;
