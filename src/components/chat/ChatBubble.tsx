import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Bubble,
  IMessage,
  RenderMessageTextProps,
  Reply,
  User,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import {
  CHAT_SELECTED_MESSAGE_COLOR,
  PRIMARY_COLOR,
} from '../../config/constants/constants';

interface ChatBubbleProps {
  messageSelected: IMessage | null;
  handleMessageOptions: (message: IMessage) => void;
  currentMessage: IMessage;
  nextMessage: IMessage | undefined;
  previousMessage: IMessage | undefined;
  user: User | undefined;
  renderMessageText:
    | ((props: RenderMessageTextProps<IMessage>) => ReactNode)
    | undefined;
  position: 'left' | 'right';
  onQuickReply: ((replies: Reply[]) => void) | undefined;
}

const ChatBubble: FC<ChatBubbleProps> = ({
  messageSelected,
  handleMessageOptions,
  currentMessage,
  nextMessage,
  previousMessage,
  user,
  renderMessageText,
  position,
  onQuickReply,
}) => {
  const insets = useSafeAreaInsets();
  const isSelected = messageSelected?._id === currentMessage?._id;

  return (
    <View
      style={{
        ...styles.messageContainer,
        marginBottom:
          !nextMessage?._id && insets.bottom !== 0 ? insets.bottom : 0,
      }}
    >
      <Bubble
        currentMessage={currentMessage}
        nextMessage={nextMessage}
        previousMessage={previousMessage}
        user={user}
        renderMessageText={renderMessageText}
        position={position}
        onQuickReply={onQuickReply}
        wrapperStyle={{
          right: {
            backgroundColor: isSelected
              ? CHAT_SELECTED_MESSAGE_COLOR
              : PRIMARY_COLOR,
          },
        }}
      />
      <MaterialIcons
        name="more-vert"
        size={24}
        color="grey"
        onPress={() => handleMessageOptions(currentMessage)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    width: '100%',
    flexDirection: 'row',
  },
});

export default ChatBubble;
