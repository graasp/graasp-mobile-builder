import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { replaceMentionValues } from 'react-native-controlled-mentions';
import { IMessage, Send } from 'react-native-gifted-chat';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import { PRIMARY_COLOR } from '../../config/constants/constants';
import { useQueryClient } from '../../context/QueryClientContext';
import { convertIMessageToText } from '../../utils/functions/chat';

interface SendMessageProps {
  itemId: UUID;
  text: string;
  messageSelected: IMessage | null;
  handleMessageSelected: (message: IMessage | null) => void;
  handleIsEditMessage: (value: boolean) => void;
  handleInputMessage: (inputText: string) => void;
}

const SendMessage: FC<SendMessageProps> = ({
  itemId,
  text,
  messageSelected,
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
      ({ id, name }) => {
        mentions.push(id);
        return `\`<!@${id}>[${name}]\``;
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
  };

  return (
    <Send
      disabled={!text}
      containerStyle={styles.sendButtonContainer}
      onSend={(messages) => onSend(convertIMessageToText(messages))}
      text={text}
    >
      <MaterialIcons name="send" size={24} color={PRIMARY_COLOR} />
    </Send>
  );
};

const styles = StyleSheet.create({
  sendButtonContainer: {
    paddingLeft: 12,
    paddingRight: 12,
  },
});

export default SendMessage;
