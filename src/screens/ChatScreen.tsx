import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  MentionInput,
  replaceMentionValues,
} from 'react-native-controlled-mentions';
import { Button, ListItem } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { Bubble, GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import Markdown from 'react-native-markdown-display';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { Member, UUID } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import {
  CHAT_MESSAGE_OPTIONS_DELETE,
  CHAT_MESSAGE_OPTIONS_EDIT,
} from '../../e2e/constants/testIds';
import CustomBackdrop from '../components/common/CustomBackdrop';
import {
  CHAT_SELECTED_MESSAGE_COLOR,
  MENTION_CHAT_TRIGGER,
  MENTION_REGEX,
  PRIMARY_COLOR,
  PRIMARY_LIGHT_COLOR,
  UNKNOWN_CHAT_MEMBER,
} from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import {
  convertToGiftedMessages,
  getPlainString,
  replaceMessageWithMentions,
} from '../utils/functions/chat';

const ChatScreen: FC<ItemScreenProps<'ItemStackChat'>> = ({ route }) => {
  const { hooks } = useQueryClient();
  const navigation = useNavigation();
  const { itemId } = route.params;
  const bottomSheetMessageOptionsModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['20%', '40%'], []);
  const [messageSelected, setMessageSelected] = useState<IMessage | null>(null);
  const [isEditMessage, setIsEditMessage] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatMembers, setChatMembers] = useState<
    Pick<Member, 'id' | 'name'>[] | null
  >(null);
  const { t } = useTranslation();
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
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(itemId);
  const { mutations } = useQueryClient();
  const { mutate: postMessage } = mutations.usePostItemChatMessage();
  const { mutate: patchMessage } = mutations.usePatchItemChatMessage();
  const { mutate: deleteMessage } = mutations.useDeleteItemChatMessage();

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

  useEffect(() => {
    if (itemMemberships) {
      const chatMembers: Pick<Member, 'id' | 'name'>[] = itemMemberships.map(
        ({ member }) => ({
          id: member.id,
          name: member.name,
        }),
      );
      setChatMembers(chatMembers);
    }
  }, [itemMemberships]);

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
    !currentMember ||
    isLoadingItemMemberships ||
    !itemMemberships ||
    !chatMembers
  ) {
    return null;
  }
  if (isErrorItemChat || isErrorCurrentMember || isErrorItemMemberships) {
    return null;
  }

  const messages = convertToGiftedMessages(itemChat);

  const postChatMessage = async (
    newMessages: IMessage[] = [],
    mentions?: string[],
  ) => {
    postMessage({
      itemId,
      body: newMessages[0].text,
      mentions: mentions || [],
    });
  };

  const patchChatMessage = async (editedMessages: IMessage[] = []) => {
    if (messageSelected) {
      patchMessage({
        itemId,
        messageId: messageSelected._id as string,
        body: editedMessages[0].text,
      });
    }
  };

  const onSend = async (messages: IMessage[] = []) => {
    const mentions: string[] = [];
    const replacedMentionsMessage = [
      {
        ...messages[0],
        text: replaceMentionValues(messages[0].text, ({ id, name }) => {
          mentions.push(id);
          return `\`<!@${id}>[${name}]\``;
        }),
      },
    ];
    if (messageSelected) {
      await patchChatMessage(replacedMentionsMessage);
      setMessageSelected(null);
    } else {
      await postChatMessage(replacedMentionsMessage, mentions);
    }
    setIsEditMessage(false);
  };

  const handleMessageOptions = (message: IMessage) => {
    setMessageSelected(message);
    handleOpenBottomSheetMessageOptionsModal();
  };

  const handleEditItemPress = (message: IMessage) => {
    bottomSheetMessageOptionsModalRef.current?.close();
    setIsEditMessage(true);
    setInputMessage(replaceMessageWithMentions(message.text));
  };

  const handleDeleteItemPress = (messageId: UUID) => {
    deleteMessage({
      itemId,
      messageId,
    });
    bottomSheetMessageOptionsModalRef.current?.close();
    setMessageSelected(null);
  };

  const handleOnBackDropPressed = () => {
    bottomSheetMessageOptionsModalRef.current?.close();
    setIsEditMessage(false);
    setMessageSelected(null);
  };

  const renderSuggestions: FC<any> = ({ keyword, onSuggestionPress }) => {
    if (keyword == null) {
      return null;
    }
    return (
      <View style={styles.suggestionContainer}>
        {chatMembers
          .filter(({ name }) =>
            name.toLowerCase().includes(keyword.toLowerCase()),
          )
          .map(({ id, name }) => (
            <Pressable
              key={id}
              onPress={() => onSuggestionPress({ id, name })}
              style={{ padding: 10 }}
            >
              <Text>{name}</Text>
            </Pressable>
          ))}
      </View>
    );
  };

  const renderComposer = (props: any) => {
    const { text } = props;
    return (
      <View style={styles.composerContainer}>
        {isEditMessage && (
          <View
            {...props}
            style={{
              width: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons
              name="cancel"
              size={24}
              color={PRIMARY_COLOR}
              onPress={() => handleCancelEditMessage()}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <MentionInput
            {...props}
            placeholder={t('Type somenthing....')}
            style={{ paddingLeft: 10 }}
            value={text}
            onChange={(value) => setInputMessage(value)}
            partTypes={[
              {
                trigger: MENTION_CHAT_TRIGGER,
                renderSuggestions,
                textStyle: { fontWeight: 'bold', color: PRIMARY_COLOR },
                getPlainString: (mention) => getPlainString(mention),
              },
            ]}
          />
        </View>
        <View
          {...props}
          style={{
            width: 60,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send
            {...props}
            disabled={!text}
            containerStyle={styles.sendButtonContainer}
          >
            <MaterialIcons
              {...props}
              name="send"
              size={24}
              color={PRIMARY_COLOR}
            />
          </Send>
        </View>
      </View>
    );
  };

  const handleCancelEditMessage = () => {
    setInputMessage('');
    setIsEditMessage(false);
    setMessageSelected(null);
  };

  const chatMentionsReplacer = (text: string) => {
    const userId = text.match(MENTION_REGEX)?.groups?.id;
    const userName =
      itemMemberships?.find(({ member }) => member.id === userId)?.member
        .name || UNKNOWN_CHAT_MEMBER;
    return MENTION_CHAT_TRIGGER + userName;
  };

  const rules = {
    code_inline: (node: any) => {
      const messageTextMentions = node.content.replace(
        MENTION_REGEX,
        chatMentionsReplacer,
      );
      return <Text key={node.key}>{messageTextMentions}</Text>;
    },
  };

  const renderMessageText = (props: any) => {
    return (
      <View style={{ marginLeft: 12, marginRight: 12 }}>
        <Markdown
          style={{
            textgroup: {
              color:
                currentMember.id === props.currentMessage.user._id
                  ? '#fff'
                  : '#000',
            },
          }}
          rules={rules}
        >
          {props.currentMessage.text}
        </Markdown>
      </View>
    );
  };

  const renderBubble = (props: any) => {
    const { currentMessage } = props;
    const isSelected = messageSelected?._id === currentMessage?._id;

    return (
      <View style={styles.messageContainer}>
        <Bubble
          {...props}
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

  return (
    <>
      <>
        <BottomSheetModal
          containerStyle={{ flex: 1 }}
          ref={bottomSheetMessageOptionsModalRef}
          style={styles.bottomSheetModal}
          index={0}
          snapPoints={snapPoints}
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
                <>
                  <ListItem
                    onPress={() => handleEditItemPress(messageSelected)}
                    style={{ paddingLeft: insets.left }}
                    containerStyle={styles.messageOptionsContainer}
                    testID={CHAT_MESSAGE_OPTIONS_EDIT}
                  >
                    <MaterialIcons name="edit" size={24} color="grey" />
                    <ListItem.Content style={{ flexDirection: 'row' }}>
                      <ListItem.Title style={{ flex: 2 }}>
                        {t('Edit')}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                  <ListItem
                    onPress={() =>
                      handleDeleteItemPress(messageSelected._id as string)
                    }
                    style={{ paddingLeft: insets.left }}
                    containerStyle={styles.messageOptionsContainer}
                    testID={CHAT_MESSAGE_OPTIONS_DELETE}
                  >
                    <MaterialIcons name="delete" size={24} color="grey" />
                    <ListItem.Content style={{ flexDirection: 'row' }}>
                      <ListItem.Title style={{ flex: 2 }}>
                        {t('Delete')}
                      </ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                </>
              )}
            </View>
          </NativeViewGestureHandler>
        </BottomSheetModal>
      </>

      <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
        <GiftedChat
          {...{ messages, onSend }}
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
  messageContainer: {
    width: '100%',
    flexDirection: 'row',
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
  composerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  suggestionContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    backgroundColor: '#aaa8e8',
    zIndex: 1,
    borderRadius: 5,
    marginLeft: 12,
    padding: 5,
  },
  sendButtonContainer: {
    width: 50,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  messageOptionsContainer: {
    backgroundColor: PRIMARY_LIGHT_COLOR,
  },
});

export default ChatScreen;
