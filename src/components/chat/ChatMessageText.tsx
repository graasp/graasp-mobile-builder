import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IMessage } from 'react-native-gifted-chat';
import Markdown, { ASTNode } from 'react-native-markdown-display';

import { CompleteMember, UUID } from '@graasp/sdk';

import { MENTION_REGEX } from '../../config/constants/constants';
import { useQueryClient } from '../../context/QueryClientContext';
import { chatMentionsReplacer } from '../../utils/functions/chat';

interface ChatMessageTextProps {
  itemId: UUID;
  currentMessage: IMessage;
  currentMember: CompleteMember;
}

const ChatMessageText: FC<ChatMessageTextProps> = ({
  itemId,
  currentMessage,
  currentMember,
}) => {
  const { hooks } = useQueryClient();
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(itemId);

  if (isLoadingItemMemberships || !itemMemberships) {
    return null;
  }
  if (isErrorItemMemberships) {
    console.error('Error in ChatMessageText');
    return null;
  }

  const rules = {
    code_inline: (node: ASTNode) => {
      const messageTextMentions = node.content.replace(MENTION_REGEX, (text) =>
        chatMentionsReplacer(text, itemMemberships),
      );
      return <Text key={node.key}>{messageTextMentions}</Text>;
    },
  };

  return (
    <View style={styles.messageText}>
      <Markdown
        style={{
          textgroup: {
            color:
              currentMember.id === currentMessage.user._id ? '#fff' : '#000',
          },
        }}
        rules={rules}
      >
        {currentMessage.text}
      </Markdown>
    </View>
  );
};

const styles = StyleSheet.create({
  messageText: {
    marginLeft: 12,
    marginRight: 12,
  },
});

export default ChatMessageText;
