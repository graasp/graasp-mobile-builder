import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import {
  BubbleProps,
  ComposerProps,
  GiftedChat,
  IMessage,
  MessageTextProps,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import ChatBubble from '../components/chat/ChatBubble';
import ChatComposer from '../components/chat/ChatComposer';
import ChatMessageText from '../components/chat/ChatMessageText';
import DeleteMessage from '../components/chat/DeleteMessage';
import EditMessage from '../components/chat/EditMessage';
import CustomBackdrop from '../components/common/CustomBackdrop';
import {
  BOTTOM_SNAP_POINTS_CHAT,
  PRIMARY_COLOR,
  PRIMARY_LIGHT_COLOR,
} from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import { convertToGiftedMessages } from '../utils/functions/chat';

const ChatScreen: FC<ItemScreenProps<'ItemStackChat'>> = ({ route }) => {
  const { hooks } = useQueryClient();
  const navigation = useNavigation();
  const { itemId } = route.params;
  const bottomSheetMessageOptionsModalRef = useRef<BottomSheetModal>(null);
  const [messageSelected, setMessageSelected] = useState<IMessage | null>(null);
  const [isEditMessage, setIsEditMessage] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const insets = useSafeAreaInsets();
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
    console.log('handleMessageOptionsSheetChanges', index);
  }, []);

  const handleOpenBottomSheetMessageOptionsModal = useCallback(() => {
    bottomSheetMessageOptionsModalRef.current?.present();
  }, []);

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

  const messages = convertToGiftedMessages(itemChat);

  const handleMessageOptions = (message: IMessage) => {
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

  const handleMessageSelected = (message: IMessage | null) =>
    setMessageSelected(message);

  const handleCancelEditMessage = () => {
    setInputMessage('');
    setIsEditMessage(false);
    setMessageSelected(null);
  };

  const renderComposer = ({ text }: ComposerProps) => {
    return text ? (
      <ChatComposer
        itemId={itemId}
        text={text}
        isEditMessage={isEditMessage}
        messageSelected={messageSelected}
        handleCancelEditMessage={handleCancelEditMessage}
        handleInputMessage={handleInputMessage}
        handleMessageSelected={handleMessageSelected}
        handleIsEditMessage={handleIsEditMessage}
      />
    ) : null;
  };

  const renderMessageText = ({
    currentMessage,
  }: MessageTextProps<IMessage>) => {
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
  }: Readonly<BubbleProps<IMessage>>) => {
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

  return (
    <>
      <BottomSheetModal
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
                  bottomSheetMessageOptionsModalRef={
                    bottomSheetMessageOptionsModalRef
                  }
                  handleMessageSelected={handleMessageSelected}
                />
              </View>
            )}
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
      <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
        <GiftedChat
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
        />
      </View>
    </>
  );
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
});

export default ChatScreen;
