import { useTranslation } from 'react-i18next';
import { Button, ListItem } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import {
  ITEM_LIST_OPTIONS_OPEN_MAP,
  buildPlayerButtonId,
} from '../../../e2e/constants/testIds';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../../config/constants/constants';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_MAP_VIEW,
} from '../../navigation/names';
import { ItemScreenProps } from '../../navigation/types';

type Props = {
  itemId?: DiscriminatedItem['id'];
  name: string;
  size?: number;
  color?: string;
  type?: string;
  testId?: string;
  onClick?: () => void;
};

const MapButton = ({
  itemId,
  size = 24,
  name,
  color = ITEMS_TABLE_ROW_ICON_COLOR,
  type = 'button',
  testId,
  onClick,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  const handleOpenMap = () => {
    onClick?.();
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_MAP_VIEW,
      params: {
        itemId,
        headerTitle: name,
      },
    });
  };

  const icon = (
    <MaterialIcons type="material" name="map" size={size} color={color} />
  );

  switch (type) {
    case 'list-item': {
      return (
        <ListItem
          onPress={() => handleOpenMap()}
          style={{ paddingLeft: insets.left }}
          testID={testId}
        >
          {icon}
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{t('Open Map')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      );
    }

    case 'button':
    default: {
      return (
        <Button
          buttonStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
          icon={icon}
          onPress={() => handleOpenMap()}
          testID={testId}
        />
      );
    }
  }
};

export default MapButton;
