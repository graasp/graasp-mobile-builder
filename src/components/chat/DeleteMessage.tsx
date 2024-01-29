import { FC, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import { CHAT_MESSAGE_OPTIONS_DELETE } from '../../../e2e/constants/testIds';
import { PRIMARY_LIGHT_COLOR } from '../../config/constants/constants';
import { useQueryClient } from '../../context/QueryClientContext';

interface DeleteMessageProps {
  messageSelected: IMessage;
  itemId: UUID;
  bottomSheetMessageOptionsModalRef: RefObject<BottomSheetModalMethods>;
  handleMessageSelected: (message: IMessage | null) => void;
}

const DeleteMessage: FC<DeleteMessageProps> = ({
  messageSelected,
  itemId,
  bottomSheetMessageOptionsModalRef,
  handleMessageSelected,
}) => {
  const { mutations } = useQueryClient();
  const { mutate: deleteMessage } = mutations.useDeleteItemChatMessage();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const handleDeleteItemPress = (messageId: UUID) => {
    deleteMessage({
      itemId,
      messageId,
    });
    bottomSheetMessageOptionsModalRef.current?.close();
    handleMessageSelected(null);
  };

  return (
    <ListItem
      onPress={() => handleDeleteItemPress(messageSelected._id as string)}
      style={{ paddingLeft: insets.left }}
      containerStyle={styles.messageOptionsContainer}
      testID={CHAT_MESSAGE_OPTIONS_DELETE}
    >
      <MaterialIcons name="delete" size={24} color="grey" />
      <ListItem.Content style={{ flexDirection: 'row' }}>
        <ListItem.Title style={{ flex: 2 }}>{t('Delete')}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  messageOptionsContainer: {
    backgroundColor: PRIMARY_LIGHT_COLOR,
  },
});

export default DeleteMessage;
