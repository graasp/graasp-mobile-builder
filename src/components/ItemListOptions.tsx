import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, StyleSheet } from 'react-native';
import { Button, Divider, ListItem, Overlay } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  SHARE_ITEM_BUILDER,
  SHARE_ITEM_PLAYER,
} from '../../e2e/constants/testIds';
import {
  ANALYTICS_EVENTS,
  PRIMARY_COLOR,
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
import MapButton from './common/MapButton';

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
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
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
    setShareModalVisible(true);
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
        message: `Check out this on Graasp: ${
          linkType === SHARE_OPTIONS.BUILDER
            ? `${SHARE_HOST.BUILDER}/${itemId}`
            : `${SHARE_HOST.PLAYER}/${itemId}`
        }`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          setShareModalVisible(false);
        } else {
          setShareModalVisible(false);
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
        isVisible={shareModalVisible}
        onBackdropPress={() => setShareModalVisible(false)}
      >
        <Button
          title="Player"
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          containerStyle={{ marginBottom: 20 }}
          onPress={async () => {
            await onShare(item.id, SHARE_OPTIONS.PLAYER);
          }}
          testID={SHARE_ITEM_PLAYER}
        />
        <Divider />
        <Button
          title="Builder"
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={async () => {
            await onShare(item.id, SHARE_OPTIONS.BUILDER);
          }}
          testID={SHARE_ITEM_BUILDER}
        />
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

      <BottomSheetScrollView
        contentContainerStyle={{ backgroundColor: 'white' }}
      >
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
          type="list-item"
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
        <BookmarkListItem item={item} />
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
