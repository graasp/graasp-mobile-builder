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

  const handleDetailsPress = ({ itemId }: { itemId: UUID }) => {
    bottomSheetModalRef.current?.close();
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_ITEM_DETAILS,
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
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          containerStyle={{ marginBottom: 20 }}
          onPress={async () => {
            await onShare(shareModalVisible.itemId, SHARE_OPTIONS.PLAYER);
          }}
          testID={SHARE_ITEM_PLAYER}
        />
        <Divider />
        <Button
          title="Builder"
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={async () => {
            await onShare(shareModalVisible.itemId, SHARE_OPTIONS.BUILDER);
          }}
          testID={SHARE_ITEM_BUILDER}
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
        {editItemModalVisible.itemId && item && (
          <EditItem
            itemId={editItemModalVisible.itemId}
            item={item}
            setEditItemModalVisible={setEditItemModalVisible}
            refreshItem={refreshItem}
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
        {deleteItemModalVisible.itemId && item && (
          <DeleteItem
            itemId={deleteItemModalVisible.itemId}
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

      <BottomSheetScrollView contentContainerStyle={null}>
        <ListItem
          onPress={() => handleDetailsPress({ itemId: item.id })}
          style={{ paddingLeft: insets.left }}
          testID={ITEM_LIST_OPTIONS_DETAILS}
        >
          <MaterialIcons name="info" size={24} color="grey" />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{t('Details')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        {displayEditOrDeleteItem && (
          <>
            <ListItem
              onPress={() => handleEditItemPress({ itemId: item.id })}
              style={{ paddingLeft: insets.left }}
              testID={ITEM_LIST_OPTIONS_EDIT}
            >
              <MaterialIcons name="edit" size={24} color="grey" />
              <ListItem.Content style={{ flexDirection: 'row' }}>
                <ListItem.Title style={{ flex: 2 }}>{t('Edit')}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem
              onPress={() => handleDeleteItemPress({ itemId: item.id })}
              style={{ paddingLeft: insets.left }}
              testID={ITEM_LIST_OPTIONS_DELETE}
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
        <ListItem
          onPress={() => handleSharePress({ itemId: item.id })}
          style={{ paddingLeft: insets.left }}
          testID={ITEM_LIST_OPTIONS_SHARE}
        >
          <MaterialIcons name="share" size={24} color="grey" />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{t('Share')}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <BookmarkListItem item={item} />
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
