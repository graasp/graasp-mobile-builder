import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import {
  BubbleProps,
  ComposerProps,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  MessageTextProps,
  SendProps,
} from 'react-native-gifted-chat';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import { CHAT_WRAPPER } from '../../e2e/constants/testIds';
import ChatBubble from '../components/chat/ChatBubble';
import ChatComposer from '../components/chat/ChatComposer';
import ChatMessageText from '../components/chat/ChatMessageText';
import DeleteMessage from '../components/chat/DeleteMessage';
import EditMessage from '../components/chat/EditMessage';
import SendMessage from '../components/chat/SendMessage';
import CustomBackdrop from '../components/common/CustomBackdrop';
import {
  BOTTOM_SNAP_POINTS_CHAT,
  PRIMARY_COLOR,
  PRIMARY_LIGHT_COLOR,
} from '../config/constants/constants';
import { GiftedChatMessage } from '../config/types';
import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import { convertToGiftedMessages } from '../utils/functions/chat';

const ChatScreen: FC<ItemScreenProps<'ItemStackChat'>> = ({ route }) => {
  const { hooks } = useQueryClient();
  const navigation = useNavigation();
  const { itemId } = route.params;
  const bottomSheetMessageOptionsModalRef = useRef<BottomSheetModal>(null);
  const [messageSelected, setMessageSelected] =
    useState<GiftedChatMessage | null>(null);
  const [isEditMessage, setIsEditMessage] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const chatRef = useRef<FlatList<IMessage> | null>(null);
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const {
    data: itemChat,
    isLoading: isLoadingItemChat,
    isError: isErrorItemChat,
    refetch: refetchItemChat,
  } = hooks.useItemChat(itemId);
  const {
    data: currentMember,
    isLoading: isLoadingCurrentMember,
    isError: isErrorCurrentMember,
  } = hooks.useCurrentMember();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          icon={<MaterialIcons name={'refresh'} color="#ffffff" size={25} />}
          onPress={() => refetchItemChat()}
        ></Button>
      ),
    });
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    Keyboard.dismiss();
    console.log('handleMessageOptionsSheetChanges', index);
  }, []);

  const handleOpenBottomSheetMessageOptionsModal = useCallback(() => {
    bottomSheetMessageOptionsModalRef.current?.present();
  }, []);

  const handleMessageOptions = (message: GiftedChatMessage) => {
    setMessageSelected(message);
    handleOpenBottomSheetMessageOptionsModal();
  };

  const handleOnBackDropPressed = () => {
    bottomSheetMessageOptionsModalRef.current?.close();
    setIsEditMessage(false);
    setMessageSelected(null);
  };

  const handleInputMessage = (inputText: string) => setInputMessage(inputText);

  const handleIsEditMessage = (value: boolean) => setIsEditMessage(value);

  const handleMessageSelected = (message: GiftedChatMessage | null) =>
    setMessageSelected(message);

  const handlePostDeleteMessage = () => {
    bottomSheetMessageOptionsModalRef.current?.close();
    setInputMessage('');
    setMessageSelected(null);
  };

  const handleCancelEditMessage = () => {
    setInputMessage('');
    setIsEditMessage(false);
    setMessageSelected(null);
  };

  if (itemChat && currentMember) {
    const messages = convertToGiftedMessages(itemChat);

    const renderComposer = ({
      composerHeight,
      onInputSizeChanged,
    }: ComposerProps) => {
      return (
        <ChatComposer
          itemId={itemId}
          inputMessage={inputMessage}
          isEditMessage={isEditMessage}
          composerHeight={composerHeight}
          onInputSizeChanged={onInputSizeChanged}
          handleCancelEditMessage={handleCancelEditMessage}
          handleInputMessage={handleInputMessage}
        />
      );
    };

    const renderMessageText = ({
      currentMessage,
    }: MessageTextProps<GiftedChatMessage>) => {
      return currentMessage ? (
        <ChatMessageText
          itemId={itemId}
          currentMessage={currentMessage}
          currentMember={currentMember}
        />
      ) : null;
    };

    const renderBubble = ({
      currentMessage,
      nextMessage,
      previousMessage,
      user,
      renderMessageText,
      position,
      onQuickReply,
    }: Readonly<BubbleProps<GiftedChatMessage>>) => {
      return currentMessage ? (
        <ChatBubble
          messageSelected={messageSelected}
          handleMessageOptions={handleMessageOptions}
          nextMessage={nextMessage}
          currentMessage={currentMessage}
          previousMessage={previousMessage}
          user={user}
          renderMessageText={renderMessageText}
          position={position}
          onQuickReply={onQuickReply}
        />
      ) : null;
    };

    const renderSend = ({ text }: SendProps<GiftedChatMessage>) => {
      return (
        <SendMessage
          itemId={itemId}
          text={text}
          messageSelected={messageSelected}
          chatRef={chatRef}
          handleMessageSelected={handleMessageSelected}
          handleIsEditMessage={handleIsEditMessage}
          handleInputMessage={handleInputMessage}
        />
      );
    };

    const renderInputToolbar = (
      props: InputToolbarProps<GiftedChatMessage>,
    ) => {
      return (
        <InputToolbar
          {...props}
          containerStyle={{ marginBottom: insets.bottom }}
          primaryStyle={styles.inputToolbar}
        />
      );
    };

    return (
      <>
        <BottomSheetModal
          animateOnMount={!reducedMotion}
          containerStyle={{ flex: 1 }}
          ref={bottomSheetMessageOptionsModalRef}
          style={styles.bottomSheetModal}
          index={0}
          snapPoints={BOTTOM_SNAP_POINTS_CHAT}
          onChange={handleSheetChanges}
          backgroundStyle={styles.messageOptionsContainer}
          backdropComponent={({ animatedIndex, style: backDropStyle }) => (
            <CustomBackdrop
              animatedIndex={animatedIndex}
              style={backDropStyle}
              onBackDropPressed={() => handleOnBackDropPressed()}
            />
          )}
        >
          <NativeViewGestureHandler disallowInterruption={true}>
            <View style={{ flex: 1 }}>
              {messageSelected && (
                <View style={{ flex: 1 }}>
                  <EditMessage
                    messageSelected={messageSelected}
                    bottomSheetMessageOptionsModalRef={
                      bottomSheetMessageOptionsModalRef
                    }
                    handleInputMessage={handleInputMessage}
                    handleIsEditMessage={handleIsEditMessage}
                  />
                  <DeleteMessage
                    messageSelected={messageSelected}
                    itemId={itemId}
                    handlePostDeleteMessage={handlePostDeleteMessage}
                  />
                </View>
              )}
            </View>
          </NativeViewGestureHandler>
        </BottomSheetModal>
        <View testID={CHAT_WRAPPER} style={{ ...styles.container }}>
          <GiftedChat
            messageContainerRef={chatRef}
            messages={messages}
            user={{
              _id: currentMember?.id,
            }}
            text={inputMessage}
            onInputTextChanged={(message) => setInputMessage(message)}
            inverted={false}
            alignTop={false}
            renderBubble={renderBubble}
            renderComposer={renderComposer}
            renderMessageText={renderMessageText}
            renderSend={renderSend}
            renderInputToolbar={renderInputToolbar}
          />
        </View>
      </>
    );
  }

  if (
    isLoadingItemChat ||
    !itemChat ||
    isLoadingCurrentMember ||
    !currentMember
  ) {
    return null;
  }
  if (isErrorItemChat || isErrorCurrentMember) {
    console.error('Error in ChatScreen');
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomSheetModal: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  messageOptionsContainer: {
    backgroundColor: PRIMARY_LIGHT_COLOR,
  },
  inputToolbar: {
    alignItems: 'center',
  },
});

export default ChatScreen;
