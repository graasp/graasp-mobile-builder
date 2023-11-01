import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, StyleSheet } from 'react-native';
import { Button, Divider, ListItem, Overlay } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import {
  ANALYTICS_EVENTS,
  SHARE_HOST,
  SHARE_OPTIONS,
  VIEWS,
} from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';
import ActivityIndicator from './ActivityIndicator';
import DeleteItem from './DeleteItem';
import EditItem from './EditItem';

interface ItemListOptionsProps {
  itemSelected: DiscriminatedItem;
  bottomSheetModalRef: any;
  navigation: any;
  refresh: () => void;
}

const ItemListOptions: FC<ItemListOptionsProps> = ({
  itemSelected,
  bottomSheetModalRef,
  navigation,
  refresh,
}) => {
  const { hooks } = useQueryClient();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(itemSelected.id);
  const {
    data: currentMember,
    isLoading: isLoadingCurrentMember,
    isError: isErrorCurrentMember,
  } = hooks.useCurrentMember();
  const [shareModalVisible, setShareModalVisible] = useState<{
    toggle: boolean;
    itemId: UUID | null;
  }>({
    toggle: false,
    itemId: null,
  });
  const [editItemModalVisible, setEditItemModalVisible] = useState<{
    toggle: boolean;
    itemId: UUID | null;
  }>({
    toggle: false,
    itemId: null,
  });
  const [deleteItemModalVisible, setDeleteItemModalVisible] = useState<{
    toggle: boolean;
    itemId: UUID | null;
  }>({
    toggle: false,
    itemId: null,
  });

  if (isLoadingItemMemberships || isLoadingCurrentMember) {
    return <ActivityIndicator />;
  }

  if (isErrorItemMemberships || isErrorCurrentMember) {
    return null;
  }

  const handleDetailsPress = ({ itemId }: { itemId: UUID }) => {
    bottomSheetModalRef.current?.close();
    navigation.push('CommonStack', {
      screen: 'CommonStackDetail',
      params: { itemId },
    });
  };

  const handleEditItemPress = ({ itemId }: { itemId: UUID }) => {
    setEditItemModalVisible({ toggle: true, itemId });
  };

  const handleDeleteItemPress = ({ itemId }: { itemId: UUID }) => {
    setDeleteItemModalVisible({ toggle: true, itemId });
  };

  const handleSharePress = ({ itemId }: { itemId: UUID }) => {
    setShareModalVisible({ toggle: true, itemId });
  };

  const onShare = async (itemId: UUID | null, linkType: any) => {
    try {
      if (itemId === null) {
        throw new Error('No itemId');
      }
      const result = await Share.share({
        message: `Check out this on Graasp: ${
          linkType === SHARE_OPTIONS.BUILDER
            ? `${SHARE_HOST.BUILDER}/${itemId}`
            : `${SHARE_HOST.PLAYER}/${itemId}`
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          setShareModalVisible({ toggle: false, itemId: null });
        } else {
          setShareModalVisible({ toggle: false, itemId: null });
        }
        await customAnalyticsEvent(ANALYTICS_EVENTS.SHARE_GRAASP_LINK, {
          method:
            linkType === SHARE_OPTIONS.BUILDER ? VIEWS.BUILDER : VIEWS.PLAYER,
        });
      } else if (result.action === Share.dismissedAction) {
        //setModalVisible({ toggle: false, itemId: null });
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  const displayEditOrDeleteItem = checkWriteOrAdminItemMembership(
    itemSelected.id,
    currentMember?.id,
    itemMemberships,
  );

  return (
    <>
      <Overlay
        overlayStyle={styles.modalView}
        isVisible={shareModalVisible.toggle && shareModalVisible.itemId != null}
        onBackdropPress={() =>
          setShareModalVisible({ toggle: false, itemId: null })
        }
      >
        <Button
          title="Player"
          raised={true}
          buttonStyle={{ backgroundColor: '#5050d2' }}
          containerStyle={{ marginBottom: 20 }}
          onPress={async () => {
            await onShare(shareModalVisible.itemId, SHARE_OPTIONS.PLAYER);
          }}
        />
        <Divider />
        <Button
          title="Builder"
          raised={true}
          buttonStyle={{ backgroundColor: '#5050d2' }}
          onPress={async () => {
            await onShare(shareModalVisible.itemId, SHARE_OPTIONS.BUILDER);
          }}
        />
      </Overlay>
      <Overlay
        overlayStyle={styles.modalEditItemView}
        isVisible={
          editItemModalVisible.toggle && editItemModalVisible.itemId != null
        }
        onBackdropPress={() =>
          setEditItemModalVisible({ toggle: false, itemId: null })
        }
      >
        {editItemModalVisible.itemId && itemSelected && (
          <EditItem
            itemId={editItemModalVisible.itemId}
            item={itemSelected}
            setEditItemModalVisible={setEditItemModalVisible}
            refresh={refresh}
          />
        )}
      </Overlay>
      <Overlay
        overlayStyle={styles.modalEditItemView}
        isVisible={
          deleteItemModalVisible.toggle && deleteItemModalVisible.itemId != null
        }
        onBackdropPress={() =>
          setDeleteItemModalVisible({ toggle: false, itemId: null })
        }
      >
        {deleteItemModalVisible.itemId && itemSelected && (
          <DeleteItem
            itemId={deleteItemModalVisible.itemId}
            item={itemSelected}
            setDeleteItemModalVisible={setDeleteItemModalVisible}
            bottomSheetModalRef={bottomSheetModalRef}
            refresh={refresh}
          />
        )}
      </Overlay>

      <ListItem
        onPress={() => handleDetailsPress({ itemId: itemSelected.id })}
        style={{ paddingLeft: insets.left }}
        hasTVPreferredFocus={undefined}
        tvParallaxProperties={undefined}
      >
        <MaterialIcons name="info" size={24} color="grey" />
        <ListItem.Content style={{ flexDirection: 'row' }}>
          <ListItem.Title style={{ flex: 2 }}>{t('Details')}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      {displayEditOrDeleteItem && (
        <>
          <ListItem
            onPress={() => handleEditItemPress({ itemId: itemSelected.id })}
            style={{ paddingLeft: insets.left }}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <MaterialIcons name="edit" size={24} color="grey" />
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <ListItem.Title style={{ flex: 2 }}>{t('Edit')}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            onPress={() => handleDeleteItemPress({ itemId: itemSelected.id })}
            style={{ paddingLeft: insets.left }}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <MaterialIcons name="delete" size={24} color="grey" />
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <ListItem.Title style={{ flex: 2 }}>{t('Delete')}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </>
      )}
      <ListItem
        onPress={() => handleSharePress({ itemId: itemSelected.id })}
        style={{ paddingLeft: insets.left }}
        hasTVPreferredFocus={undefined}
        tvParallaxProperties={undefined}
      >
        <MaterialIcons name="share" size={24} color="grey" />
        <ListItem.Content style={{ flexDirection: 'row' }}>
          <ListItem.Title style={{ flex: 2 }}>{t('Share')}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalEditItemView: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '85%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ItemListOptions;
