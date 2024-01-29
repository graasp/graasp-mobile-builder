import { FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import { CHAT_MESSAGE_OPTIONS_EDIT } from '../../../e2e/constants/testIds';
import { PRIMARY_LIGHT_COLOR } from '../../config/constants/constants';
import { replaceMessageWithMentions } from '../../utils/functions/chat';

interface EditMessageProps {
  messageSelected: IMessage;
  bottomSheetMessageOptionsModalRef: RefObject<BottomSheetModalMethods>;
  handleInputMessage: (inputText: string) => void;
  handleIsEditMessage: (value: boolean) => void;
}

const EditMessage: FC<EditMessageProps> = ({
  messageSelected,
  bottomSheetMessageOptionsModalRef,
  handleInputMessage,
  handleIsEditMessage,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleEditItemPress = (message: IMessage) => {
    bottomSheetMessageOptionsModalRef.current?.close();
    handleIsEditMessage(true);
    handleInputMessage(replaceMessageWithMentions(message.text));
  };

  return (
    <ListItem
      onPress={() => handleEditItemPress(messageSelected)}
      style={{ paddingLeft: insets.left }}
      containerStyle={styles.messageOptionsContainer}
      testID={CHAT_MESSAGE_OPTIONS_EDIT}
    >
      <MaterialIcons name="edit" size={24} color="grey" />
      <ListItem.Content style={{ flexDirection: 'row' }}>
        <ListItem.Title style={{ flex: 2 }}>{t('Edit')}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  messageOptionsContainer: {
    backgroundColor: PRIMARY_LIGHT_COLOR,
  },
});

export default EditMessage;
