import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements';

import { ItemType, UUID } from '@graasp/sdk';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import {
  CANCEL_CREATE_FOLDER,
  CONFIRM_CREATE_FOLDER,
  FOLDER_NAME_INPUT,
} from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS, PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface CreateFolderProps {
  setCreateItemModalVisible: React.Dispatch<
    React.SetStateAction<{
      toggle: boolean;
    }>
  >;
  bottomSheetAddItemModalRef: React.RefObject<BottomSheetModalMethods>;
  refresh: () => void;
  parentId?: UUID;
}

const CreateFolder: FC<CreateFolderProps> = ({
  setCreateItemModalVisible,
  bottomSheetAddItemModalRef,
  parentId,
}) => {
  const [itemName, setItemName] = useState<string | undefined>('');
  const { t } = useTranslation();
  const { mutations } = useQueryClient();
  const { mutate: postItem } = mutations.usePostItem();

  const mutateItem = async () => {
    const itemNameSingleSpaces = itemName?.replace(/ +(?= )/g, '');
    if (!itemNameSingleSpaces) {
      console.error(`name ${itemNameSingleSpaces} is empty`);
    } else {
      postItem({
        name: itemNameSingleSpaces,
        parentId,
        type: ItemType.FOLDER,
      });
      setCreateItemModalVisible({ toggle: false });
      bottomSheetAddItemModalRef.current?.close();
      await customAnalyticsEvent(ANALYTICS_EVENTS.CREATE_FOLDER);
    }
  };

  return (
    <>
      <Input
        label={t('Folder name')}
        placeholder={t('Folder name')}
        onChangeText={(value) => setItemName(value)}
        value={itemName}
        underlineColorAndroid={'black'}
        labelStyle={{
          color: 'black',
          fontWeight: '700',
        }}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#cccccc"
        testID={FOLDER_NAME_INPUT}
      />
      <View style={styles.acceptSaveItem}>
        <Button
          title={t('Create')}
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={mutateItem}
          testID={CONFIRM_CREATE_FOLDER}
        />
      </View>
      <Button
        title="Cancel"
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={() => setCreateItemModalVisible({ toggle: false })}
        testID={CANCEL_CREATE_FOLDER}
      />
    </>
  );
};

const styles = StyleSheet.create({
  acceptSaveItem: {
    marginTop: 30,
    marginBottom: 10,
  },
});

export default CreateFolder;
