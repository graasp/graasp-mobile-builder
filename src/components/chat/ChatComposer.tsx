import { FC, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputContentSizeChangeEventData,
  View,
} from 'react-native';
import { MentionInput, Suggestion } from 'react-native-controlled-mentions';
import { MIN_COMPOSER_HEIGHT } from 'react-native-gifted-chat';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import {
  CHAT_MAX_LENGTH,
  MENTION_CHAT_TRIGGER,
  PRIMARY_COLOR,
} from '../../config/constants/constants';
import { getPlainString } from '../../utils/functions/chat';
import SuggestionMembers from './SuggestionMembers';

interface ChatComposerProps {
  itemId: UUID;
  inputMessage: string;
  isEditMessage: boolean;
  composerHeight?: number;
  onInputSizeChanged?: (layout: { width: number; height: number }) => void;
  handleCancelEditMessage: () => void;
  handleInputMessage: (inputText: string) => void;
}

const ChatComposer: FC<ChatComposerProps> = ({
  itemId,
  inputMessage,
  isEditMessage,
  composerHeight = MIN_COMPOSER_HEIGHT,
  onInputSizeChanged,
  handleCancelEditMessage,
  handleInputMessage,
}) => {
  const { t } = useTranslation();

  const dimensionsRef = useRef<{ width: number; height: number }>();

  const determineInputSizeChange = useCallback(
    (dimensions: { width: number; height: number }) => {
      if (!dimensions) {
        return;
      }

      if (
        !dimensionsRef ||
        !dimensionsRef.current ||
        (dimensionsRef.current &&
          (dimensionsRef.current.width !== dimensions.width ||
            dimensionsRef.current.height !== dimensions.height))
      ) {
        dimensionsRef.current = dimensions;
        if (onInputSizeChanged) {
          onInputSizeChanged(dimensions);
        }
      }
    },
    [onInputSizeChanged],
  );

  const handleContentSizeChange = ({
    nativeEvent: { contentSize },
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) =>
    determineInputSizeChange(contentSize);

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

  return (
    <>
      {isEditMessage && (
        <View
          style={{
            ...styles.editMessage,
            height: composerHeight,
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

      <MentionInput
        placeholder={t('Type something....')}
        multiline={true}
        maxLength={CHAT_MAX_LENGTH}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        onContentSizeChange={handleContentSizeChange}
        value={inputMessage}
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
        containerStyle={[
          styles.containerTextInput,
          {
            height: composerHeight,
          },
        ]}
        style={[
          styles.textInput,
          {
            height: composerHeight,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  editMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 16,
    alignSelf: 'center',
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
  containerTextInput: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default ChatComposer;
