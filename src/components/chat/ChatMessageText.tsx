import { FC } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Markdown, { ASTNode } from 'react-native-markdown-display';

import { CompleteMember, UUID } from '@graasp/sdk';

import {
  CHAT_WIDTH_IMAGE_MESSAGE,
  MENTION_REGEX,
  PRIMARY_COLOR,
} from '../../config/constants/constants';
import { ChatMessage } from '../../config/types';
import { useQueryClient } from '../../context/QueryClientContext';
import { chatMentionsReplacer } from '../../utils/functions/chat';

interface ChatMessageTextProps {
  itemId: UUID;
  currentMessage: ChatMessage;
  currentMember: CompleteMember;
}

const ChatMessageText: FC<ChatMessageTextProps> = ({
  itemId,
  currentMessage,
  currentMember,
}) => {
  const { width, height } = useWindowDimensions();
  const { hooks } = useQueryClient();
  const { data: itemMemberships, isLoading: isLoadingItemMemberships } =
    hooks.useItemMemberships(itemId);

  if (itemMemberships) {
    const rules = {
      code_inline: (node: ASTNode) => {
        const messageTextMentions = node.content.replace(
          MENTION_REGEX,
          (text) => chatMentionsReplacer(text, itemMemberships),
        );
        return <Text key={node.key}>{messageTextMentions}</Text>;
      },
      image: (node: ASTNode) => {
        return (
          <Image
            style={{
              width: width * CHAT_WIDTH_IMAGE_MESSAGE,
              height:
                ((height * CHAT_WIDTH_IMAGE_MESSAGE) / width) *
                CHAT_WIDTH_IMAGE_MESSAGE *
                width *
                CHAT_WIDTH_IMAGE_MESSAGE,
            }}
            resizeMode="contain"
            source={{
              uri: node.attributes.src,
            }}
            key={node.key}
          ></Image>
        );
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
            blockquote: {
              backgroundColor: PRIMARY_COLOR,
            },
          }}
          rules={rules}
        >
          {currentMessage.text}
        </Markdown>
      </View>
    );
  }

  if (isLoadingItemMemberships || !itemMemberships) {
    return null;
  }
  return null;
};

const styles = StyleSheet.create({
  messageText: {
    marginLeft: 12,
    marginRight: 12,
  },
});

export default ChatMessageText;
