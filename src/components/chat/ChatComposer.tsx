import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { MentionInput, Suggestion } from 'react-native-controlled-mentions';
import { IMessage } from 'react-native-gifted-chat';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import {
  MENTION_CHAT_TRIGGER,
  PRIMARY_COLOR,
} from '../../config/constants/constants';
import { getPlainString } from '../../utils/functions/chat';
import SendMessage from './SendMessage';
import SuggestionMembers from './SuggestionMembers';

interface ChatComposerProps {
  itemId: UUID;
  text: string;
  isEditMessage: boolean;
  messageSelected: IMessage | null;
  handleCancelEditMessage: () => void;
  handleInputMessage: (inputText: string) => void;
  handleMessageSelected: (message: IMessage | null) => void;
  handleIsEditMessage: (value: boolean) => void;
}

const ChatComposer: FC<ChatComposerProps> = ({
  itemId,
  text,
  isEditMessage,
  messageSelected,
  handleCancelEditMessage,
  handleInputMessage,
  handleMessageSelected,
  handleIsEditMessage,
}) => {
  const { t } = useTranslation();

  const renderSuggestions = (
    keyword: string | undefined,
    onSuggestionPress: (suggestion: Suggestion) => void,
  ) => (
    <SuggestionMembers
      itemId={itemId}
      keyword={keyword}
      onSuggestionPress={onSuggestionPress}
    />
  );

  return text ? (
    <View style={styles.composerContainer}>
      {isEditMessage && (
        <View style={styles.cancelEditButtonContainer}>
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
          placeholder={t('Type something....')}
          value={text}
          onChange={(value) => handleInputMessage(value)}
          partTypes={[
            {
              trigger: MENTION_CHAT_TRIGGER,
              renderSuggestions: ({ keyword, onSuggestionPress }) =>
                renderSuggestions(keyword, onSuggestionPress),
              textStyle: { fontWeight: 'bold', color: PRIMARY_COLOR },
              getPlainString: (mention) => getPlainString(mention),
            },
          ]}
        />
      </View>
      <SendMessage
        itemId={itemId}
        text={text}
        messageSelected={messageSelected}
        handleMessageSelected={handleMessageSelected}
        handleIsEditMessage={handleIsEditMessage}
        handleInputMessage={handleInputMessage}
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  composerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
  },
  inputContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
  cancelEditButtonContainer: {
    paddingLeft: 12,
  },
});

export default ChatComposer;
