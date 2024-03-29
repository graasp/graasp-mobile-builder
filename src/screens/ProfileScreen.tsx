import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, ListItem, Overlay, Text } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { API_ROUTES } from '@graasp/query-client';
import { formatDate } from '@graasp/sdk';

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import 'intl';

import { LOG_OUT_BUTTON } from '../../e2e/constants/testIds';
import ActivityIndicator from '../components/ActivityIndicator';
import DeleteAccount from '../components/DeleteAccount';
import LanguageSelector from '../components/LanguageSelector';
import CustomBackdrop from '../components/common/CustomBackdrop';
import {
  ANALYTICS_EVENTS,
  BOTTOM_SNAP_POINTS_PROFILE,
  DEFAULT_LOCALE,
  PRIMARY_COLOR,
  STATUS_CODES_OK,
} from '../config/constants/constants';
import { API_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '../context/QueryClientContext';
import { ROOT_NAVIGATOR_SIGN_IN } from '../navigation/names';
import { TabScreenProps } from '../navigation/types';
import { customAnalyticsEvent } from '../utils/functions/analytics';

const ProfileScreen = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [localPath, setLocalPath] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { hooks, queryClient } = useQueryClient();
  const [changeLanguageModalVisible, setChangeLanguageModalVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });
  const [deleteMemberModalVisible, setDeleteMemberVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });
  const {
    data: currentMember,
    isLoading,
    isError,
    refetch,
  } = hooks.useCurrentMember();
  const { userToken, signOut } = useAuth();
  const { navigate } =
    useNavigation<TabScreenProps<'ProfileTab'>['navigation']>();
  const bottomSheetChangeAvatarModalRef = useRef<BottomSheetModal>(null);
  /* Disable or enable the bottom sheet animateOnMount property depending on the reduced motion setting of the device. 
  It solves the bug introduced in react-native-reanimated with SDK 50 and it should be fixed in @gorhom/bottom-sheet v5 */
  const reducedMotion = useReducedMotion();
  const { data: avatarUrl } = hooks.useAvatarUrl({
    id: currentMember ? currentMember.id : undefined,
  });

  useEffect(() => {
    if (currentMember && avatarUrl) {
      downloadAvatar(avatarUrl);
    }
  }, [currentMember, avatarUrl]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleChangeAvatarSheetChanges', index);
  }, []);

  const handleOpenBottomSheetChangeAvatarModal = useCallback(() => {
    bottomSheetChangeAvatarModalRef.current?.present();
  }, []);

  const downloadAvatar = async (url: string) => {
    try {
      if (currentMember) {
        const localPath = `${FileSystem.documentDirectory}/${currentMember.id}`;

        const downloadResumable = FileSystem.createDownloadResumable(
          url,
          localPath,
        );
        await downloadResumable.downloadAsync();
        setLocalPath(localPath);
        setIsUpdating(false);
      }
    } catch {
      throw new Error();
    }
  };

  if (isLoading || !currentMember) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return null;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!file.canceled) {
      uploadAvatarImage(file);
    }
  };

  const takePhoto = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        t('You need to allow camera permission to Graasp'),
        t('Go to Settings > Graasp > Activate camera option'),
        [{ text: 'OK' }],
      );
      return;
    }

    const file = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(file);

    if (!file.canceled) {
      uploadAvatarImage(file);
    }
  };

  const uploadAvatarImage = async (file: ImagePicker.ImagePickerResult) => {
    try {
      if (!file.assets || file.assets.length === 0) {
        throw new Error('Upload file error');
      }
      setIsUpdating(true);
      const uploadResponse = await FileSystem.uploadAsync(
        `${API_HOST}/${API_ROUTES.buildUploadAvatarRoute()}`,
        file.assets[0].uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      if (!STATUS_CODES_OK.includes(uploadResponse.status)) {
        throw new Error('Upload file error');
      }
      Toast.show({
        type: 'success',
        text1: t('Success'),
        text2: t('Avatar updated correctly'),
      });
      if (avatarUrl) {
        downloadAvatar(avatarUrl);
      }
      bottomSheetChangeAvatarModalRef.current?.close();
      await customAnalyticsEvent(ANALYTICS_EVENTS.CHANGE_AVATAR);
    } catch {
      setIsUpdating(false);
      Toast.show({
        type: 'error',
        text1: t('Error'),
        text2: t('There was an error updating the avatar'),
      });
      Alert.alert(t('Upload error'), t('Please try again'), [{ text: 'OK' }]);
    }
  };

  const handleChangeLanguage = () => {
    setChangeLanguageModalVisible({ toggle: true });
  };

  const handleDeleteMember = () => {
    setDeleteMemberVisible({ toggle: true });
  };

  let AvatarComponent = null;
  if (!isUpdating) {
    if (localPath) {
      AvatarComponent = (
        <Avatar
          rounded
          size={120}
          title={currentMember.name.charAt(0)}
          containerStyle={styles.avatarContainer}
          source={{
            uri: localPath,
          }}
        />
      );
    } else {
      AvatarComponent = (
        <Avatar
          rounded
          size={120}
          title={currentMember.name.charAt(0)}
          containerStyle={styles.avatarContainer}
        />
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Overlay
        overlayStyle={styles.modalEditLanguage}
        isVisible={changeLanguageModalVisible.toggle}
        onBackdropPress={() => setChangeLanguageModalVisible({ toggle: false })}
      >
        <LanguageSelector
          setChangeLanguageModalVisible={setChangeLanguageModalVisible}
          refresh={refetch}
        />
      </Overlay>
      <Overlay
        overlayStyle={styles.modalEditLanguage}
        isVisible={deleteMemberModalVisible.toggle}
        onBackdropPress={() => setDeleteMemberVisible({ toggle: false })}
      >
        <DeleteAccount
          currentMember={currentMember}
          setDeleteAccountVisible={setDeleteMemberVisible}
        />
      </Overlay>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
      >
        {isUpdating && (
          <Avatar
            rounded
            size={120}
            icon={{ name: 'sync', type: 'material', size: 40 }}
            containerStyle={styles.avatarContainer}
          />
        )}
        {AvatarComponent}
        <Text h4 style={styles.name}>
          {currentMember.name}
        </Text>
        <Text style={styles.header}>{t('Email')}</Text>
        <Text style={styles.value}>{currentMember.email}</Text>
        <Text style={styles.header}>{t('Member Since')}</Text>
        <Text style={styles.value}>
          {formatDate(currentMember.createdAt, { locale: DEFAULT_LOCALE })}
        </Text>

        <Button
          title={t('Change avatar')}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR, marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'account-circle'}
              color="#ffffff"
              size={25}
            />
          }
          onPress={handleOpenBottomSheetChangeAvatarModal}
        ></Button>

        <Button
          title={t('Change language')}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR, marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'language'}
              color="#ffffff"
              size={25}
            />
          }
          onPress={handleChangeLanguage}
        ></Button>

        <Button
          title={t('Log Out')}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR, marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'logout'}
              color="#ffffff"
              size={25}
            />
          }
          testID={LOG_OUT_BUTTON}
          onPress={async () => {
            await signOut();
            queryClient.resetQueries();
            navigate(ROOT_NAVIGATOR_SIGN_IN);
          }}
        ></Button>

        <Button
          title={t('Delete my account')}
          buttonStyle={{ backgroundColor: '#cc3333', marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'delete'}
              color="#ffffff"
              size={25}
            />
          }
          onPress={handleDeleteMember}
        ></Button>
      </ScrollView>

      <BottomSheetModal
        animateOnMount={!reducedMotion}
        ref={bottomSheetChangeAvatarModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={BOTTOM_SNAP_POINTS_PROFILE}
        onChange={handleSheetChanges}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() =>
              bottomSheetChangeAvatarModalRef.current?.close()
            }
          />
        )}
      >
        <NativeViewGestureHandler disallowInterruption={true}>
          <View style={{ flex: 1 }}>
            <BottomSheetScrollView contentContainerStyle={null}>
              <ListItem
                onPress={() => takePhoto()}
                style={{ paddingLeft: insets.left }}
              >
                <MaterialIcons name="camera-alt" size={24} color="grey" />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Take photo')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                onPress={() => pickImage()}
                style={{ paddingLeft: insets.left }}
              >
                <MaterialIcons name="image" size={24} color="grey" />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Select image from media gallery')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheetScrollView>
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  icon: {
    alignSelf: 'center',
  },
  header: {
    color: '#4e4e4e',
  },
  name: {
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  value: {
    paddingBottom: 20,
  },
  avatarContainer: {
    backgroundColor: PRIMARY_COLOR,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  modalEditLanguage: {
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
  bottomSheetModal: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default ProfileScreen;
