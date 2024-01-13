import { MentionData } from 'react-native-controlled-mentions/dist/types';

import { ChatMessage, DiscriminatedItem } from '@graasp/sdk';

import {
  MENTION_CHAT_TRIGGER,
  MENTION_REGEX_WITH_NAME,
} from '../../config/constants/constants';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM_CHAT,
} from '../../navigation/names';
import { ItemScreenProps } from '../../navigation/types';

export const convertToGiftedMessages = (originalChat: ChatMessage[]) => {
  return originalChat.map(({ id, body, createdAt, creator }) => ({
    _id: id,
    text: body,
    createdAt: new Date(createdAt),
    user: {
      _id: creator?.id || '',
      name: creator?.name,
    },
  }));
};

export const replaceMessageWithMentions = (rawMessageText: string) => {
  return rawMessageText
    .replace(MENTION_REGEX_WITH_NAME, (_, id, name) => {
      return `${MENTION_CHAT_TRIGGER}[${name}](${id})`;
    })
    .replace(/`/g, '');
};

export const getPlainString = (mention: MentionData) => {
  return MENTION_CHAT_TRIGGER + mention.name;
};

export const handleOpenChat = async (
  navigation: ItemScreenProps<'ItemStackItem'>['navigation'],
  item: DiscriminatedItem,
) => {
  navigation.navigate(ITEM_NAVIGATOR, {
    screen: ITEM_NAVIGATOR_ITEM_CHAT,
    params: { itemId: item.id, headerTitle: item.name },
  });
};
