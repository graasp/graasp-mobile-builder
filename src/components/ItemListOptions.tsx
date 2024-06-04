import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, StyleSheet } from 'react-native';
import { Divider, ListItem, Overlay, Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-qr-code';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import {
  ITEM_LIST_OPTIONS_DELETE,
  ITEM_LIST_OPTIONS_DETAILS,
  ITEM_LIST_OPTIONS_EDIT,
  ITEM_LIST_OPTIONS_MAP,
  ITEM_LIST_OPTIONS_OPEN_CHAT,
  ITEM_LIST_OPTIONS_SHARE,
  ITEM_LIST_OPTIONS_SHOW_QR_CODE,
} from '../../e2e/constants/testIds';
import {
  ANALYTICS_EVENTS,
  SHARE_HOST,
  SHARE_OPTIONS,
  VIEWS,
} from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM_CHAT,
  ITEM_NAVIGATOR_ITEM_DETAILS,
} from '../navigation/names';
import { ItemScreenProps } from '../navigation/types';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';
import ActivityIndicator from './ActivityIndicator';
import BookmarkListItem from './BookmarkListItem';
import DeleteItem from './DeleteItem';
import EditItem from './EditItem';
import ItemIcon from './ItemIcon';
import MapButton, { MapButtonType } from './common/MapButton';

interface ItemListOptionsProps {
  itemSelected: DiscriminatedItem;
  bottomSheetModalRef: any;
  refresh: () => void;
}

const ItemListOptions: FC<ItemListOptionsProps> = ({
  itemSelected,
  bottomSheetModalRef,
  refresh,
}) => {
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  const { hooks } = useQueryClient();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const {
    data: item,
    isLoading: isLoadingItem,
    isError: isErrorItem,
    refetch: refreshItem,
  } = hooks.useItem(itemSelected.id);
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
  const [showQrCodeModalVisible, setShowQrCodeModalVisible] =
    useState<boolean>(false);
  const [editItemModalVisible, setEditItemModalVisible] =
    useState<boolean>(false);
  const [deleteItemModalVisible, setDeleteItemModalVisible] =
    useState<boolean>(false);

  if (
    isLoadingItem ||
    !item ||
    isLoadingItemMemberships ||
    isLoadingCurrentMember
  ) {
    return <ActivityIndicator />;
  }

  if (isErrorItem || isErrorItemMemberships || isErrorCurrentMember) {
    return null;
  }

  const closeSheet = () => {
    bottomSheetModalRef.current?.close();
  };

  const handleDetailsPress = () => {
    closeSheet();
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_ITEM_DETAILS,
      params: { itemId: item.id },
    });
  };

  const handleEditItemPress = () => {
    setEditItemModalVisible(true);
  };

  const handleDeleteItemPress = () => {
    setDeleteItemModalVisible(true);
  };

  const handleSharePress = () => {
    onShare(item.id, SHARE_OPTIONS.BUILDER);
  };

  const handleShowQrCodePress = () => {
    setShowQrCodeModalVisible(true);
  };

  const handleOpenChat = async () => {
    closeSheet();
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_ITEM_CHAT,
      params: { itemId: item.id, headerTitle: item.name },
    });
  };

  const onShare = async (itemId: UUID | null, linkType: any) => {
    try {
      if (itemId === null) {
        throw new Error('No itemId');
      }
      const result = await Share.share({
        message: `Check out ${item.name} on Graasp: ${
          linkType === SHARE_OPTIONS.BUILDER
            ? `${SHARE_HOST.BUILDER}/${itemId}`
            : `${SHARE_HOST.PLAYER}/${itemId}`
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          setShowQrCodeModalVisible(false);
        } else {
          setShowQrCodeModalVisible(false);
        }
        await customAnalyticsEvent(ANALYTICS_EVENTS.SHARE_GRAASP_LINK, {
          method:
            linkType === SHARE_OPTIONS.BUILDER ? VIEWS.BUILDER : VIEWS.PLAYER,
        });
      } else if (result.action === Share.dismissedAction) {
        // do nothing
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
        isVisible={showQrCodeModalVisible}
        onBackdropPress={() => setShowQrCodeModalVisible(false)}
      >
        <QRCode value={`${SHARE_HOST.BUILDER}/${item.id}`} />
        <Text style={{ fontSize: 20, marginTop: 5 }}>{item.name}</Text>
        <Text>{item.creator?.name}</Text>
      </Overlay>
      <Overlay
        overlayStyle={styles.modalEditItemView}
        isVisible={editItemModalVisible}
        onBackdropPress={() => setEditItemModalVisible(false)}
      >
        {editItemModalVisible && item && (
          <EditItem
            itemId={item.id}
            item={item}
            setEditItemModalVisible={setEditItemModalVisible}
            refreshItem={refreshItem}
          />
        )}
      </Overlay>
      <Overlay
        overlayStyle={styles.modalEditItemView}
        isVisible={deleteItemModalVisible}
        onBackdropPress={() => setDeleteItemModalVisible(false)}
      >
        {deleteItemModalVisible && item && (
          <DeleteItem
            itemId={item.id}
            item={item}
            setDeleteItemModalVisible={setDeleteItemModalVisible}
            bottomSheetModalRef={bottomSheetModalRef}
            refresh={refresh}
          />
        )}
      </Overlay>

      <ListItem style={{ paddingLeft: insets.left }}>
        <ItemIcon type={item.type} extra={item.extra} />
        <ListItem.Content style={{ flexDirection: 'row' }}>
          <ListItem.Title style={{ flex: 2 }}>{item.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <Divider
        style={{
          width: '100%',
          marginBottom: 10,
          marginLeft: insets.left,
        }}
      />

      <BottomSheetScrollView>
        <ListItem
          onPress={() => handleDetailsPress()}
          style={{ paddingLeft: insets.left }}
          testID={ITEM_LIST_OPTIONS_DETAILS}
        >
          <MaterialIcons name="info" size={24} color="grey" />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{t('Details')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        {displayEditOrDeleteItem && (
          <ListItem
            onPress={() => handleEditItemPress()}
            style={{ paddingLeft: insets.left }}
            testID={ITEM_LIST_OPTIONS_EDIT}
          >
            <MaterialIcons name="edit" size={24} color="grey" />
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <ListItem.Title style={{ flex: 2 }}>{t('Edit')}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
        <ListItem
          onPress={() => handleOpenChat()}
          style={{ paddingLeft: insets.left }}
          testID={ITEM_LIST_OPTIONS_OPEN_CHAT}
        >
          <MaterialIcons name="chat" size={24} color="grey" />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>
              {t('Open Chatbox')}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>

        <MapButton
          testId={ITEM_LIST_OPTIONS_MAP}
          itemId={item.id}
          name={item.name}
          type={MapButtonType.ListItem}
          onClick={closeSheet}
        />
        <ListItem
          onPress={() => handleSharePress()}
          style={{ paddingLeft: insets.left }}
          testID={ITEM_LIST_OPTIONS_SHARE}
        >
          <MaterialIcons name="share" size={24} color="grey" />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{t('Share')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem
          onPress={() => handleShowQrCodePress()}
          style={{ paddingLeft: insets.left }}
          testID={ITEM_LIST_OPTIONS_SHOW_QR_CODE}
        >
          <MaterialIcons name="qr-code" size={24} color="grey" />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>
              {t('Show QR code')}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <BookmarkListItem item={item} onClick={closeSheet} />
        {displayEditOrDeleteItem && (
          <ListItem
            onPress={() => handleDeleteItemPress()}
            style={{ paddingLeft: insets.left }}
            testID={ITEM_LIST_OPTIONS_DELETE}
          >
            <MaterialIcons name="delete" size={24} color="grey" />
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <ListItem.Title style={{ flex: 2 }}>{t('Delete')}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
      </BottomSheetScrollView>
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
