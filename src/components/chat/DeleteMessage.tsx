import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { UUID } from '@graasp/sdk';

import { CHAT_MESSAGE_OPTIONS_DELETE } from '../../../e2e/constants/testIds';
import { PRIMARY_LIGHT_COLOR } from '../../config/constants/constants';
import { GiftedChatMessage } from '../../config/types';
import { useQueryClient } from '../../context/QueryClientContext';

interface DeleteMessageProps {
  messageSelected: GiftedChatMessage;
  itemId: UUID;
  handlePostDeleteMessage: () => void;
}

const DeleteMessage: FC<DeleteMessageProps> = ({
  messageSelected,
  itemId,
  handlePostDeleteMessage,
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
    handlePostDeleteMessage();
  };

  return (
    <ListItem
      onPress={() => handleDeleteItemPress(messageSelected._id)}
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
