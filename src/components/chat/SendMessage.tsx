import { FC, RefObject } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { replaceMentionValues } from 'react-native-controlled-mentions';
import { IMessage, Send } from 'react-native-gifted-chat';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import {
  MENTION_CHAT_TRIGGER,
  PRIMARY_COLOR,
  PRIMARY_LIGHT_COLOR,
} from '../../config/constants/constants';
import { ChatMessage } from '../../config/types';
import { useQueryClient } from '../../context/QueryClientContext';
import { convertIMessageToText } from '../../utils/functions/chat';

interface SendMessageProps {
  itemId: UUID;
  text?: string;
  messageSelected: ChatMessage | null;
  chatRef?: RefObject<FlatList<IMessage>>;
  handleMessageSelected: (message: ChatMessage | null) => void;
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
        messageId: messageSelected._id as string,
        body: editedMessageText,
      });
    }
  };

  const onSend = async (text: string | undefined) => {
    if (!text) {
      return;
    }

    const mentions: string[] = [];
    const replacedMentionsMessage = replaceMentionValues(
      text,
      ({ id, name, trigger, original }) => {
        if (trigger === MENTION_CHAT_TRIGGER) {
          mentions.push(id);
          return `\`<!@${id}>[${name}]\``;
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
    handleIsEditMessage(false);
    handleInputMessage('');
    if (chatRef && chatRef.current) {
      chatRef.current.scrollToEnd?.();
    }
  };

  return (
    <Send
      disabled={!text}
      containerStyle={styles.sendButtonContainer}
      onSend={(messages) => onSend(convertIMessageToText(messages))}
      text={text}
      alwaysShowSend={true}
    >
      <MaterialIcons
        name="send"
        size={24}
        color={text ? PRIMARY_COLOR : PRIMARY_LIGHT_COLOR}
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
