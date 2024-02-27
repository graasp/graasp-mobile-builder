import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { CHAT_BUTTON_HEADER } from '../../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../../config/constants/constants';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM_CHAT,
} from '../../navigation/names';
import { ItemScreenProps } from '../../navigation/types';

type ChatButtonProps = {
  item: DiscriminatedItem;
};

const ChatButton = ({ item }: ChatButtonProps) => {
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  const handleOpenChat = async () => {
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_ITEM_CHAT,
      params: { itemId: item.id, headerTitle: item.name },
    });
  };

  return (
    <Button
      buttonStyle={{ backgroundColor: PRIMARY_COLOR, width: 40 }}
      icon={<MaterialIcons name="chat" color="#ffffff" size={25} />}
      onPress={handleOpenChat}
      testID={CHAT_BUTTON_HEADER}
    ></Button>
  );
};

export default ChatButton;
