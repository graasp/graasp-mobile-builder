import { FC, RefObject } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { replaceMentionValues } from 'react-native-controlled-mentions';
import { IMessage, Send } from 'react-native-gifted-chat';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import { CHAT_SEND_BUTTON } from '../../../e2e/constants/testIds';
import {
  MENTION_CHAT_TRIGGER,
  PRIMARY_COLOR,
  PRIMARY_LIGHT_COLOR,
  buildChatMentionRegex,
} from '../../config/constants/constants';
import { GiftedChatMessage } from '../../config/types';
import { useQueryClient } from '../../context/QueryClientContext';
import { convertIMessageToText } from '../../utils/functions/chat';

interface SendMessageProps {
  itemId: UUID;
  text?: string;
  messageSelected: GiftedChatMessage | null;
  chatRef?: RefObject<FlatList<IMessage>>;
  handleMessageSelected: (message: GiftedChatMessage | null) => void;
  handleIsEditMessage: (value: boolean) => void;
  handleInputMessage: (inputText: string) => void;
}

const SendMessage: FC<SendMessageProps> = ({
  itemId,
  text,
  messageSelected,
  chatRef,
  handleMessageSelected,
  handleIsEditMessage,
  handleInputMessage,
}) => {
  const { mutations } = useQueryClient();
  const { mutate: postMessage } = mutations.usePostItemChatMessage();
  const { mutate: patchMessage } = mutations.usePatchItemChatMessage();

  const postChatMessage = async (
    newMessageText: string,
    mentions?: string[],
  ) => {
    postMessage({
      itemId,
      body: newMessageText,
      mentions: mentions || [],
    });
  };

  const patchChatMessage = async (editedMessageText: string) => {
    if (messageSelected) {
      patchMessage({
        itemId,
        messageId: messageSelected._id,
        body: editedMessageText,
      });
    }
  };

  const onSend = async (text?: string) => {
    if (!text) {
      return;
    }

    const mentions: string[] = [];
    const replacedMentionsMessage = replaceMentionValues(
      text,
      ({ id, name, trigger, original }) => {
        if (trigger === MENTION_CHAT_TRIGGER) {
          mentions.push(id);
          return buildChatMentionRegex(id, name);
        }
        return original;
      },
    );
    if (messageSelected) {
      await patchChatMessage(replacedMentionsMessage);
      handleMessageSelected(null);
    } else {
      await postChatMessage(replacedMentionsMessage, mentions);
    }
    if (chatRef && chatRef.current) {
      chatRef.current.scrollToEnd?.();
    }
    handleIsEditMessage(false);
    handleInputMessage('');
  };

  return (
    <Send
      disabled={!text}
      containerStyle={styles.sendButtonContainer}
      onSend={(messages) => onSend(convertIMessageToText(messages))}
      text={text}
      alwaysShowSend
    >
      <MaterialIcons
        name="send"
        size={24}
        color={text ? PRIMARY_COLOR : PRIMARY_LIGHT_COLOR}
        testID={CHAT_SEND_BUTTON}
      />
    </Send>
  );
};

const styles = StyleSheet.create({
  sendButtonContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
  },
});

export default SendMessage;
