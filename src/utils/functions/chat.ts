import { MentionData } from 'react-native-controlled-mentions/dist/types';
import { IMessage } from 'react-native-gifted-chat';

import { ChatMessage, ItemMembership } from '@graasp/sdk';

import {
  MENTION_CHAT_TRIGGER,
  MENTION_REGEX,
  MENTION_REGEX_WITH_NAME,
  UNKNOWN_CHAT_MEMBER,
} from '../../config/constants/constants';

export const convertToGiftedMessages = (originalChat: ChatMessage[]) =>
  originalChat.map(({ id, body, createdAt, creator }) => ({
    _id: id,
    text: body,
    createdAt: new Date(createdAt),
    user: {
      _id: creator?.id || '',
      name: creator?.name,
    },
  }));

export const replaceMessageWithMentions = (rawMessageText: string) =>
  rawMessageText
    .replace(MENTION_REGEX_WITH_NAME, (_, id, name) => {
      return `${MENTION_CHAT_TRIGGER}[${name}](${id})`;
    })
    .replace(/`/g, '');

export const getPlainString = (mention: MentionData) =>
  `${MENTION_CHAT_TRIGGER}${mention.name}`;

export const chatMentionsReplacer = (
  text: string,
  itemMemberships: ItemMembership[],
) => {
  const userId = text.match(MENTION_REGEX)?.groups?.id;
  const userName =
    itemMemberships?.find(({ member }) => member.id === userId)?.member.name ||
    UNKNOWN_CHAT_MEMBER;
  return `${MENTION_CHAT_TRIGGER}${userName}`;
};

export const convertIMessageToText = (
  messages: Partial<IMessage> | Partial<IMessage>[],
) => (Array.isArray(messages) ? messages[0].text : messages.text);
